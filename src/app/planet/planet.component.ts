import { Component, OnInit, ViewChild } from '@angular/core';
import { PlanetService } from '../planet.service';
import {MatTableDataSource} from '@angular/material/table';
import {MatSort, MatSortable} from '@angular/material/sort';
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
  dataSource: any; // TODO needs initialized as an interface
  isLoading = true;
  error = false;
  displayedColumns: string[] = ['name', 'climate', 'terrain', 'population', 'res', 'waterSA'];

  @ViewChild(MatSort)
  sort: MatSort = new MatSort;

  ngAfterViewInit() {
    this.dataSource.sort = this.sort;
  }

  constructor(private SWAPI: PlanetService) { }


  // Helper functions
  format_helper(obj: any){
    // clone to new obj
    let newObj = JSON.parse(JSON.stringify(obj));

    for (const key of Object.keys(newObj)) {

      // number formatting
      if (key != 'created' && key != 'edited'){ // skip dates
        if (parseInt(newObj[key]) > 999){
          newObj[key] = this.formatNumber(parseInt(newObj[key]));
        }
      }

      // replace any unknown strings with ?
      if (obj[key] === 'unknown') {
        newObj[key] = '?';
      }
    }
    return newObj;
  }

  // Format number spacing every 3 with ' '
  // Returns a string
   formatNumber(num: number) {
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
  }

  ngOnInit(): void {

    this.origObj = this.SWAPI.getPlanets().subscribe({
      next: data => {
        this.isLoading = false;
        this.origObj = data;
        let newParent: object[] = [];

        // Loop through each result
        for (let x=0; x < this.origObj.results.length; x++){

          // Copies obj and replaces any unknown values, number formatting
          this.planetObj = this.format_helper(this.origObj.results[x]);

          // Number of permanement residents (res)
          this.planetObj.res = Array.isArray(this.origObj.results[x].residents) ? this.origObj.results[x].residents.length : 0;

          // Convert water surface area (waterSA)
              // TODO break out func  getPlanetSA(diam) or similar
          let planetSA = (4 * Math.PI * (parseInt(this.origObj.results[x].diameter) / 2) **2);
          let waterPercentage = parseInt(this.origObj.results[x].surface_water);

          if (Number.isInteger(waterPercentage)){ // avoid NaN
            waterPercentage = waterPercentage / 100;
            let waterSA = Math.round(planetSA * waterPercentage)

            // format number as needed
            this.planetObj.waterSA = waterSA > 999 ? this.formatNumber(waterSA) : waterSA.toString();
            this.planetObj.waterSA = `${this.planetObj.waterSA} km\u00B2` // ^2
          }
          else this.planetObj.waterSA = '?';

          // Save wrangled row object to parent obj
          newParent.push(this.planetObj);
        }

        // Set table source
        this.dataSource = new MatTableDataSource(newParent);

        // Sort table by name desc as default
        this.sort.sort(({ id: 'name', start: 'asc'}) as MatSortable);
        this.dataSource.sort = this.sort;
      },
      error: error => {
          console.error('There was an error!', error);
          this.error = true;
          this.isLoading = false;
      }
    })


  }

}
