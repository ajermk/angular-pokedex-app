import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../pokemon-service/pokemon.service';
import { Subscription, forkJoin } from 'rxjs';

@Component({
  selector: 'pokemon-list-item',
  templateUrl: './pokemon-list-item.component.html',
  styleUrls: [],
})
export class PokemonListItemComponent implements OnInit, OnDestroy {
  private pokemonServiceSubscription!: Subscription;
  pokemonList: Pokemon[] = [];
  loaded: boolean = false;

  constructor(private pokemonService: PokemonService) {}


  ngOnInit(): void {
    this.pokemonServiceSubscription = this.pokemonService.getPokemonAll(0).subscribe({
      next: (pokemonList) => {
        this.pokemonList = pokemonList;
        forkJoin(this.pokemonService.getPokemonImages(this.pokemonList)).subscribe(
          {
            next: (pokemonList) => {
              this.pokemonList = pokemonList;
              this.loaded = true;
            }
          }
        );
      },
      error: (err) => console.log(err)
    }
    )
  }

  ngOnDestroy(): void {
    this.pokemonServiceSubscription.unsubscribe();
  }
}
