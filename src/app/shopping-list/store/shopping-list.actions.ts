import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export enum ShoppingListTypeActions {
  ADD_INGREDIENT = "ADD_INGREDIENT",
}

export class AddIngredient implements Action {
  readonly type = ShoppingListTypeActions.ADD_INGREDIENT;
  payload: Ingredient;
}
