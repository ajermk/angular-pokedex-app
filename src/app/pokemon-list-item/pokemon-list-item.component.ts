import { CommonModule } from '@angular/common';
import { Component, HostListener, Input, OnDestroy, OnInit, SimpleChange, SimpleChanges } from '@angular/core';
import { Pokemon } from '../shared/pokemon';
import { PokemonService } from '../pokemon-service/pokemon.service';
import { Subscription, combineLatest, forkJoin } from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'pokemon-list-item',
  templateUrl: './pokemon-list-item.component.html',
  styleUrls: ['./pokemon-list-item.component.css'],
})
export class PokemonListItemComponent implements OnInit, OnDestroy {

  private pokemonServiceSubscription!: Subscription;
  pokemonList: Pokemon[] = [];
  loaded: boolean = false;
  offsetIsZero = false;
  offset: number = 1;
  pokemonPerPage = 10;

  constructor(private pokemonService: PokemonService, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParamMap.subscribe((params) => {
      this.loaded = false;
      let pathOffset = params.get('offset');

      if (pathOffset) {
        this.offset = Number(pathOffset);
      }

      if (this.offset <= 0) {
        this.offset = 1;
      } 
    
      if (this.offset > 1016) {
        this.offset = 1016;
      }

      console.log('Query params ', this.offset);
      this.retrievePokemonListFromService();
    });
  }

  ngOnDestroy(): void {
    this.pokemonServiceSubscription.unsubscribe();
  }

  onClickNextButton() {
    this.router.navigate(['./'], {
      queryParams: {offset: this.offset+this.pokemonPerPage},
      relativeTo: this.route
    });
  }

  onClickBackButton() {
    this.router.navigate(['./'], {
      queryParams: {offset: this.offset-this.pokemonPerPage},
      relativeTo: this.route
    });
  }

  private retrievePokemonListFromService() {
    console.log(this.offset);
    this.pokemonServiceSubscription = this.pokemonService.getPokemonAll(this.offset, this.pokemonPerPage).subscribe({
      next: (pokemonList) => {
        console.log("calling all:")
        console.log(pokemonList);
        this.pokemonList = pokemonList;
        forkJoin(this.pokemonService.getPokemonImages(this.pokemonList, this.offset)).subscribe(
          {
            next: (pokemonList) => {
              console.log("calling images")
              console.log(pokemonList);
              this.pokemonList = pokemonList;
              this.loaded = true;
            }
          }
        );
      },
      error: (err) => console.log(err)
    }
    );
  }
}
