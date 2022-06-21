import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import { Recipe } from "../../../models/recipe";
import {RecipeService} from "../../services/recipe.service";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {
  @Output() currentRecipeSelected = new EventEmitter<Recipe>();

  recipes: Recipe[] = [];

  constructor(private recipeService: RecipeService) { }

  ngOnInit(): void {
    this.recipes = this.recipeService.getRecipes();
  }

  onRecipeSelected(recipe: Recipe) {
    this.currentRecipeSelected.emit(recipe);
  }
}
