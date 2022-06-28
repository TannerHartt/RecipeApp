import { Injectable } from '@angular/core';
import {HttpClient, HttpParams} from '@angular/common/http';
import { RecipeService } from './recipe.service';
import { Recipe } from '../../models/recipe';
import {exhaustMap, map, pipe, take, tap} from 'rxjs';
import {AuthService} from './auth.service';

@Injectable({
  providedIn: 'root'
})
export class DataStorageService {
  baseUrl = 'https://recipebook-15b30-default-rtdb.firebaseio.com';

  constructor(private http: HttpClient, private recipeService: RecipeService, private authService: AuthService) {  }

  storeRecipes() {
    const recipes = this.recipeService.getRecipes();
    return this.http.put(`${this.baseUrl}/recipes.json`, recipes)
      .subscribe(response => {
        console.log(response);
      }
    );
  }

  fetchRecipes() {
    return this.http.get<Recipe[]>(`${this.baseUrl}/recipes.json`).pipe(
      map(recipes => {
        return recipes.map(recipe => {
          return {...recipe, ingredients: recipe.ingredients ? recipe.ingredients : [] };
        })
      }),
      tap(recipes => {
        this.recipeService.setRecipes(recipes);
      })
    );
  }
}
