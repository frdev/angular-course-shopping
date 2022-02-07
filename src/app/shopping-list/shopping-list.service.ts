import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";

@Injectable({
  providedIn: "root",
})
export class ShoppingListService {
  ingredientsChanged = new Subject<Ingredient[]>();
  startedEditting = new Subject<number>();

  private shoppingList: Ingredient[] = [
    new Ingredient("Apples", 5),
    new Ingredient("Tomatoes", 10),
  ];

  constructor() {}

  get() {
    return this.shoppingList.slice();
  }

  getIndex(index: number) {
    return this.get()[index];
  }

  add(ingredient: Ingredient) {
    this.shoppingList.push(ingredient);

    this.ingredientsChanged.next(this.get());
  }

  update(index: number, ingredient: Ingredient) {
    this.shoppingList[index] = { ...ingredient };

    this.ingredientsChanged.next(this.get());
  }

  delete(index: number) {
    this.shoppingList.splice(index, 1);

    this.ingredientsChanged.next(this.get());
  }

  addIngredients(ingredients: Ingredient[]) {
    this.shoppingList = [...this.shoppingList, ...ingredients];

    this.ingredientsChanged.next(this.get());
  }
}
