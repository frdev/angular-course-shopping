import { Ingredient } from "../../shared/ingredient.model";
import {
  ShoppingListTypeActions,
  ShoppingListActions,
} from "./shopping-list.actions";

export interface ShoppingListState {
  ingredients: Ingredient[];
  editedIngredient: Ingredient;
  editedIngredientIndex: number;
}

export const INITIAL_STATE: ShoppingListState = {
  ingredients: [new Ingredient("Apples", 5), new Ingredient("Tomatoes", 10)],
  editedIngredient: null,
  editedIngredientIndex: -1,
};

export const shoppingListReducer = (
  state: ShoppingListState = INITIAL_STATE,
  action: ShoppingListActions
) => {
  switch (action.type) {
    case ShoppingListTypeActions.ADD_INGREDIENT:
      return { ...state, ingredients: [...state.ingredients, action.payload] };

    case ShoppingListTypeActions.ADD_INGREDIENTS:
      return {
        ...state,
        ingredients: [...state.ingredients, ...action.payload],
      };

    case ShoppingListTypeActions.UPDATE_INGREDIENT:
      const updatedIngredient = {
        ...state.ingredients[state.editedIngredientIndex],
        ...action.payload,
      };

      const updatedIngredients = [...state.ingredients];
      updatedIngredients[state.editedIngredientIndex] = updatedIngredient;

      return {
        ...state,
        ingredients: updatedIngredients,
      };

    case ShoppingListTypeActions.DELETE_INGREDIENT:
      return {
        ...state,
        ingredients: state.ingredients.filter(
          (_, index) => index !== state.editedIngredientIndex
        ),
      };

    case ShoppingListTypeActions.START_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredient: { ...state.ingredients[action.payload] },
        editedIngredientIndex: action.payload,
      };

    case ShoppingListTypeActions.STOP_EDIT_INGREDIENT:
      return {
        ...state,
        editedIngredient: null,
        editedIngredientIndex: -1,
      };

    default:
      return state;
  }
};
