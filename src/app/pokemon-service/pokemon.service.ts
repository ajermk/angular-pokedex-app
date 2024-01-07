import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, map, mergeMap, Observable, share, tap, throwError } from 'rxjs';
import { Pokemon } from '../shared/pokemon';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PokemonService {

  private pokeUrl: string = 'https://pokeapi.co/api/v2/pokemon';

  constructor(private http: HttpClient) {}

  getPokemon(id: number): Observable<Pokemon> {
    const specificPokeUrl: string = this.pokeUrl + '/' + id;
    return this.http.get<Pokemon>(specificPokeUrl).pipe(
      map((data: any) => this.performPokemonDeserialization(data)),
      catchError((err) => this.handleError(err))
    );
  }

  getPokemonAll(offset: number, pokemonPerPage: number): Observable<Pokemon[]> {
    return this.performPaginatedCall(offset, pokemonPerPage);
  }

  getPokemonImages(pokemonList: Pokemon[], offset: number) {
    let observables = [];
    for(let i = offset; i < offset+pokemonList.length; i++) {
      observables.push(this.getPokemon(i));
    }

    return observables;
  }

  private performPaginatedCall(offset: number, pokemonPerPage: number) {
    const pokeUrlWithPagination: string = this.pokeUrl + `/?offset=${offset}&limit=${pokemonPerPage}}`;
    console.log(pokeUrlWithPagination)
    return this.http.get<Pokemon[]>(pokeUrlWithPagination).pipe(
      map((data: any) => this.performPokemonListDeserialization(data)),
      catchError((err) => this.handleError(err))
    );
  }

  private handleError(err: HttpErrorResponse) {
    let errorMessage = '';
    if (err.error instanceof ErrorEvent) {
      errorMessage = `error occurred: ${err.error.message}`;
    } else {
      errorMessage = `server returned code: ${err.status} error message is: ${err.message}`;
    }

    console.error(errorMessage);
    return throwError(() => errorMessage);
  }

  private performPokemonDeserialization(data: any): Pokemon {
    console.log(data);
    const pokemon: Pokemon = {
        id: data.id,
        name: data.name,
        type: data.types[0].type.name,
        imageIcon: data.sprites.front_default,
        imageIconAnimated: data.sprites.versions['generation-v']['black-white'].animated.front_default,
        image: data.sprites.other['official-artwork'].front_default
      };
    return pokemon;
  }

  private performPokemonListDeserialization(data: any): Pokemon[] {
    let listOfPokemon: Pokemon[] = [];
    data.results.forEach((element: any) => {
      const pokemon: Pokemon = {
        id: element.url.replace(/.*?(\d+)[^\d]*$/,'$1'),
        name: element.name
      };
      listOfPokemon.push(pokemon);
    })
    return listOfPokemon;
  }
}
