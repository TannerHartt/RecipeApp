import { Component, OnInit } from '@angular/core';
import {Ingredient} from "../../../models/ingredient";
import {ShoppingListService} from "../../services/shopping-list.service";

@Component({
  selector: 'app-shopping-list',
  templateUrl: './shopping-list.component.html',
  styleUrls: ['./shopping-list.component.css']
})
export class ShoppingListComponent implements OnInit {

  ingredients: Ingredient[] = [];

  constructor(private listService: ShoppingListService) { }

  ngOnInit(): void {
    this.ingredients = this.listService.getIngredients();
    this.listService.ingredientsChanged.subscribe((ingredients: Ingredient[]) => {
      this.ingredients = ingredients;
    });
  }


}
