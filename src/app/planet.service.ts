import { Injectable } from '@angular/core';

import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { map, catchError} from 'rxjs/operators';

import { APIPlanetInterface } from './planet';

@Injectable({
  providedIn: 'root',
})

export class PlanetService {

  // Defaults to page one, could add ?page=2 etc to url below
  // Further implementations could use the Material Table pagination feature
  private baseUrl = "https://swapi.dev/api/planets/";
  constructor(private http: HttpClient) {}


  public getPlanets(){
    return this.http.get<APIPlanetInterface[]>(this.baseUrl);
  }

}
