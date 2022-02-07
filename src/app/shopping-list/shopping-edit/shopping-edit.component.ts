import {
  Component,
  OnInit,
  ElementRef,
  ViewChild,
  OnDestroy,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Subscription } from "rxjs";

import { Ingredient } from "../../shared/ingredient.model";
import { ShoppingListService } from "../shopping-list.service";

@Component({
  selector: "app-shopping-edit",
  templateUrl: "./shopping-edit.component.html",
  styleUrls: ["./shopping-edit.component.css"],
})
export class ShoppingEditComponent implements OnInit, OnDestroy {
  @ViewChild("formAddItem") formAddItem: NgForm;
  editMode = false;
  shoppingIndex: number;
  shoppingEditSubscription: Subscription;

  constructor(private shoppingListService: ShoppingListService) {}

  ngOnInit() {
    this.shoppingEditSubscription =
      this.shoppingListService.startedEditting.subscribe((index) => {
        this.editMode = true;
        this.shoppingIndex = index;

        const { name, amount } = this.shoppingListService.getIndex(index);

        this.formAddItem.setValue({
          name,
          amount,
        });
      });
  }

  ngOnDestroy() {
    this.shoppingEditSubscription.unsubscribe();
  }

  onSubmit() {
    const { name, amount } = this.formAddItem.value;

    const ingredient = new Ingredient(name, amount);

    this.editMode
      ? this.shoppingListService.update(this.shoppingIndex, ingredient)
      : this.shoppingListService.add(ingredient);

    this.onClear();
  }

  onRemove() {
    this.shoppingListService.delete(this.shoppingIndex);

    this.onClear();
  }

  onClear() {
    this.editMode = false;
    this.shoppingIndex = null;
    this.formAddItem.reset();
  }
}
