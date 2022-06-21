import {EventEmitter, Injectable} from '@angular/core';
import {Recipe} from "../../models/recipe";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  private recipes: Recipe[] = [
    new Recipe('A test recipe', 'Testing', "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png"),
    new Recipe('A test recipe', 'Testing', "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png")
  ];

  recipeSelected = new EventEmitter<Recipe>();

  constructor() { }

  getRecipes() {
    return this.recipes.slice();
  }
}
