import { Action } from "@ngrx/store";
import { Ingredient } from "../../shared/ingredient.model";
import {
  ShoppingListTypeActions,
  AddIngredient,
} from "./shopping-list.actions";

interface State {
  ingredients: Ingredient[];
}

const INITIAL_STATE: State = {
  ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
};

const shoppingListReducer = (
  state: State = INITIAL_STATE,
  action: AddIngredient
) => {
  switch (action.type) {
    case ShoppingListTypeActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    default:
      return state;
  }
};

export default shoppingListReducer;
