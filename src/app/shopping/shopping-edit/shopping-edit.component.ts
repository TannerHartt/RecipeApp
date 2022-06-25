import {Component, OnDestroy, OnInit, ViewChild} from '@angular/core';
import {Ingredient} from "../../../models/ingredient";
import {ShoppingListService} from "../../services/shopping-list.service";
import {NgForm} from "@angular/forms";
import {Subscription} from "rxjs";

@Component({
  selector: 'app-shopping-edit',
  templateUrl: './shopping-edit.component.html',
  styleUrls: ['./shopping-edit.component.css']
})
export class ShoppingEditComponent implements OnInit, OnDestroy {

  @ViewChild('form') listForm: NgForm;
  subscription: Subscription;
  editMode = false;
  editedItemIndex: number;
  currentEditedItem: Ingredient;

  constructor(private listService: ShoppingListService) { }

  ngOnInit(): void {
    this.subscription = this.listService.startedEditing.subscribe((index: number) => {
      this.editedItemIndex = index;
      this.editMode = true;
      this.currentEditedItem = this.listService.getIngredient(index);
      this.listForm.setValue({
        name: this.currentEditedItem.name,
        amount: this.currentEditedItem.amount
      });
    });
  }

  onAddItem(form: NgForm) {
    const value = form.value;
    const newIngredient = new Ingredient(value.name, value.amount);
    if (this.editMode) {
      this.listService.updateIngredient(this.editedItemIndex, newIngredient);
    } else {
      this.listService.addIngredient(newIngredient);
    }
    this.editMode = false;
    form.reset();
  }

  onClear() {
    this.listForm.reset();
    this.editMode = false;
  }

  onDelete() {
    this.listService.deleteIngredient(this.editedItemIndex);
     this.onClear();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }
}
