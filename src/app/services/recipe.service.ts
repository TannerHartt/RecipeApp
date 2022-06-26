import { Injectable } from '@angular/core';
import { Recipe } from "../../models/recipe";
import { Ingredient } from "../../models/ingredient";
import { ShoppingListService } from "./shopping-list.service";
import { Subject } from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[];
  // private recipes: Recipe[] = [
  //   new Recipe(
  //     'A test recipe',
  //     'Testing',
  //     "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png",
  //     [
  //       new Ingredient('Meat', 1),
  //       new Ingredient('Fries', 20)
  //     ]),
  //   new Recipe(
  //     'Big Burger',
  //     'Testing',
  //     "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png",
  //     [
  //       new Ingredient('hamburger', 2),
  //       new Ingredient('fries', 10),
  //       new Ingredient('Bread/buns', 2),
  //       new Ingredient('Bacon', 3),
  //     ]),
  // ];

  constructor(private slService: ShoppingListService) { }

  getRecipes() {
    return this.recipes.slice();
  }

  AddIngredientsToShoppingList(ingredients: Ingredient[]) {
    this.slService.addIngredients(ingredients);
  }

  getRecipeById(id: number) {
    return this.recipes[id];
  }

  addRecipe(recipe: Recipe) {
    this.recipes.push(recipe);
    this.recipesChanged.next(this.recipes.slice());
  }

  updateRecipe(index: number, newRecipe: Recipe) {
    this.recipes[index] = newRecipe;
    this.recipesChanged.next(this.recipes.slice());
  }

  deleteRecipe(index: number) {
    this.recipes.splice(index, 1);
    this.recipesChanged.next(this.recipes.slice());
  }

  setRecipes(recipes: Recipe[]) {
    this.recipes = recipes;
    this.recipesChanged.next(this.recipes.slice());
  }
}
