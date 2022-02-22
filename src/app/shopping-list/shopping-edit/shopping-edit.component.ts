import { Component, OnDestroy, OnInit, ViewChild } from "@angular/core";
import { NgForm } from "@angular/forms";
import { Store } from "@ngrx/store";
import { Subscription } from "rxjs";
import { AppState } from "src/app/store/app.reducer";

import { Ingredient } from "../../shared/ingredient.model";

import {
  AddIngredient,
  DeleteIngredient,
  StopEditIngredient,
  UpdateIngredient,
} from "../store/shopping-list.actions";
import { ShoppingListState } from "../store/shopping-list.reducer";
@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("formAddItem") formAddItem: NgForm;
  editMode = false;
  shoppingEditSubscription: Subscription;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.shoppingEditSubscription = this.store
      .select("shoppingList")
      .subscribe((state) => {
        this.editMode = state.editedIngredientIndex > -1;

        if (this.editMode) this.formAddItem.setValue(state.editedIngredient);
      });
  }

  ngOnDestroy() {
    this.shoppingEditSubscription.unsubscribe();
  }

  onSubmit() {
    const { name, amount } = this.formAddItem.value;

    const ingredient = new Ingredient(name, amount);

    this.store.dispatch(
      !this.editMode
        ? new AddIngredient({ name, amount })
        : new UpdateIngredient(ingredient)
    );

    this.onClear();
  }

  onRemove() {
    this.store.dispatch(new DeleteIngredient());

    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.formAddItem.reset();

    this.store.dispatch(new StopEditIngredient());
  }
}
