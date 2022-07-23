import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanetService } from '../planet.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort} from '@angular/material/sort';

@Component({
  selector: 'app-planet',
  templateUrl: './planet.component.html',
  styleUrls: ['./planet.component.scss']
})
export class PlanetComponent implements OnInit {
  planetObj: any;
  dataSource: any;
  page:  number = 1;
  displayedColumns = ['name', 'climate', 'terrain', 'population', 'res', 'waterSA'];

  @ViewChild(MatSort)
  sort!: MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }
  constructor(private SWAPI: PlanetService) { }

  round(num: number) {
    var m = Number((Math.abs(num) * 100).toPrecision(15));
    return Math.round(m) / 100 * Math.sign(num);  
  }

  ngOnInit(): void {
    

    this.planetObj = this.SWAPI.getPlanets().subscribe({
      next: data => {
        
        this.planetObj = data;
        console.log('one',this.planetObj);
        this.dataSource = this.planetObj.results;

        // residents arr.len
        // population spacing
        // surface area covered by water

        // while (this.planetObj.next != null){
        //   console.log(this.page, this.planetObj.results);
        //   this.page ++;
        // }
        // set planet obj variables here

        for (let x=0; x < this.planetObj.results.length; x++){
          // Number of pernament residents
          this.planetObj.results[x].res = this.planetObj.results[x].residents.length;

          // % of planet that is water
          // TODO break out func  getPlanetSA(diam)
          let planetSA = (4 * Math.PI * (parseInt(this.planetObj.results[x].diameter) / 2));
          let waterPercentage = parseInt(this.planetObj.results[x].surface_water);
          console.log(planetSA, waterPercentage);

          // Convert water surface area
          if (Number.isInteger(waterPercentage)){
            // convert number to percentage
            waterPercentage = waterPercentage / 100;

            this.planetObj.results[x].waterSA = this.round(planetSA * waterPercentage) + ' km\u00B2';
          }
          else this.planetObj.results[x].waterSA = 'Unknown';

        }
      },
      error: error => {
          console.error('There was an error!', error);
      }
    })


  }

}
