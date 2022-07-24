// Handle object given by SWAPI
export interface APIPlanetInterface {
    name: string;
    diameter: string;
    rotation_period: string;
    orbital_period: string;
    gravity: string;
    population: string;
    climate: string;
    terrain: string;
    surface_water: string;
    residents: Array<object>;
    films: Array<object>;
    url: string;
    created: string;
    edited: string;
}

// Handle display object
export interface PlanetInterface {
    name: string;
    res: string;
    waterSA: string;
    population: string;
    terrain: string;
    climate: string;
    url: string;
  }
