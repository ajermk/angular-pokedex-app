import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { PokemonService } from '../pokemon-service/pokemon.service';
import { Pokemon } from '../shared/pokemon';

@Component({
  selector: 'pokemon-detail',
  templateUrl: './pokemon-detail.component.html',
})
export class PokemonDetailComponent implements OnInit, OnDestroy {
  private _pokemonDetailSubscription!: Subscription;

  pokemon: Pokemon | undefined;
  loaded: boolean = false;

  @Input() offset: number = 1;

  constructor(
    private pokemonDetailService: PokemonService,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.retrievePokemonFromService();
  }

  ngOnDestroy(): void {
    this._pokemonDetailSubscription.unsubscribe();
  }

  onBack(): void {
    this.router.navigate(['/pokemon'],
    {queryParams: { offset: this.route.snapshot.paramMap.get('id')}});
  }

  private retrievePokemonFromService() {
    const pokeId = Number(this.route.snapshot.paramMap.get('id'));
    console.log(pokeId);
    this._pokemonDetailSubscription = this.pokemonDetailService
      .getPokemon(pokeId)
      .subscribe({
        next: (data: Pokemon) => {
          this.pokemon = data;
          this.loaded = true;
        },
        error: (err) => {
          console.log(err);
        },
    });
  }
}

