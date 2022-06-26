import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { Recipe } from "../../models/recipe";
import {map} from "rxjs";

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  baseUrl = 'https://recipebook-15b30-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private recipeService: RecipeService) {  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(`${this.baseUrl}/recipes.json`, recipes)
      .subscribe(response => {
        console.log(response);
      });
  }

  fetchRecipes() {
    this.http.get<Recipe[]>(`${this.baseUrl}/recipes.json`)
      .pipe(map(recipes => {
        return recipes.map(recipes => {
          return {...recipes, ingredients: recipes.ingredients ? recipes.ingredients: []}
        });
      }))
      .subscribe(recipes => {
      this.recipeService.setRecipes(recipes);
    });
  }
}
