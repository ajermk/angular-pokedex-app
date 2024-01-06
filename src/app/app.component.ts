import { Component } from '@angular/core';
import { PokemonDetailComponent } from './pokemon-detail/pokemon-detail.component';
import { PokemonListItemComponent } from './pokemon-list-item/pokemon-list-item.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'pokedex-app';
}
