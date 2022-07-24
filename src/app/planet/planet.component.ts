import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanetService } from '../planet.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';
import { ResourceLoader } from '@angular/compiler';
import { APIPlanetInterface, PlanetInterface } from '../planet';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss']
})

export class PlanetComponent implements OnInit {
  planetObj = {} as PlanetInterface;
  origObj: any;
  dataSource: any;
  page:  number = 1;
  displayedColumns = ['name', 'climate', 'terrain', 'population', 'res', 'waterSA'];

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  constructor(private SWAPI: PlanetService) { }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);  
  }

  replace_unkown(obj: any){
    // clone to new obj
    let newObj = JSON.parse(JSON.stringify(obj));

    // replace any unknown strings with ?
    for (const key of Object.keys(newObj)) {
      if (obj[key] === 'unknown') {
        newObj[key] = '?';
      }
    }
    return newObj;
  }

  ngOnInit(): void {
    

    this.origObj = this.SWAPI.getPlanets().subscribe({
      next: data => {
        
        this.origObj = data;
       
        // TODO population spacing


        let newParent: object[] = [];
        // Loop through each result
        for (let x=0; x < this.origObj.results.length; x++){

          // Replace any unknown values
          this.planetObj = this.replace_unkown(this.origObj.results[x]);
          
          // Copy values that do not need mangling
          this.planetObj.name = this.origObj.results[x].name;
          this.planetObj.climate = this.origObj.results[x].climate;
          this.planetObj.terrain = this.origObj.results[x].terrain;


          // Number of pernament residents (res)
          this.planetObj.res = Array.isArray(this.origObj.results[x].residents) ? this.origObj.results[x].residents.length : 0;
  
          // Convert water surface area (waterSA)
          // TODO break out func  getPlanetSA(diam) or similar
          let planetSA = (4 * Math.PI * (parseInt(this.origObj.results[x].diameter) / 2));
          let waterPercentage = parseInt(this.origObj.results[x].surface_water);        
          
          if (Number.isInteger(waterPercentage)){
            waterPercentage = waterPercentage / 100;
            this.planetObj.waterSA = this.round(planetSA * waterPercentage) + ' km\u00B2';
          }
          else this.planetObj.waterSA = '?';

          newParent.push(this.planetObj);
        }

        // Set table source
        this.dataSource = new MatTableDataSource(newParent);
      },
      error: error => {
          console.error('There was an error!', error);
      }
    })


  }

}
