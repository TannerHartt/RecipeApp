import { Component, OnInit } from '@angular/core';
import { Recipe } from "../../../models/recipe";

@Component({
  selector: 'app-recipe-list',
  templateUrl: './recipe-list.component.html',
  styleUrls: ['./recipe-list.component.css']
})
export class RecipeListComponent implements OnInit {

  recipes: Recipe[] = [
    new Recipe('A test recipe', 'Testing', "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png"),
    new Recipe('A test recipe', 'Testing', "https://www.pngall.com/wp-content/uploads/8/Cooking-Recipe-PNG-High-Quality-Image.png")
  ];

  constructor() { }

  ngOnInit(): void {
  }

}
