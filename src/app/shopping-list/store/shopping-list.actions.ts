import { Action } from "@ngrx/store";
import { Ingredient } from "src/app/shared/ingredient.model";

export enum ShoppingListTypeActions {
  ADD_INGREDIENT = "[ShoppingList] Add Ingredient",
  ADD_INGREDIENTS = "[ShoppingList] Add Ingredients",
  UPDATE_INGREDIENT = "[ShoppingList] Update Ingredient",
  DELETE_INGREDIENT = "[ShoppingList] Delete Ingredient",
  START_EDIT_INGREDIENT = "[ShoppingList] Start Edit Ingredient",
  STOP_EDIT_INGREDIENT = "[ShoppingList] Stop Edit Ingredient",
}

export class AddIngredient implements Action {
  readonly type = ShoppingListTypeActions.ADD_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class AddIngredients implements Action {
  readonly type = ShoppingListTypeActions.ADD_INGREDIENTS;

  constructor(public payload: Ingredient[]) {}
}

export class UpdateIngredient implements Action {
  readonly type = ShoppingListTypeActions.UPDATE_INGREDIENT;

  constructor(public payload: Ingredient) {}
}

export class DeleteIngredient implements Action {
  readonly type = ShoppingListTypeActions.DELETE_INGREDIENT;

  constructor() {}
}

export class StartEditIngredient implements Action {
  readonly type = ShoppingListTypeActions.START_EDIT_INGREDIENT;

  constructor(public payload: number) {}
}

export class StopEditIngredient implements Action {
  readonly type = ShoppingListTypeActions.STOP_EDIT_INGREDIENT;

  constructor() {}
}

export type ShoppingListActions =
  | AddIngredient
  | AddIngredients
  | UpdateIngredient
  | DeleteIngredient
  | StartEditIngredient
  | StopEditIngredient;
