import { ActionReducerMap } from "@ngrx/store";
import * as auth from "../auth/store/auth.reducer";
import * as shoppingList from "../shopping-list/store/shopping-list.reducer";
import * as recipes from "../recipes/store/recipe.reducer";

export interface AppState {
  auth: auth.AuthState;
  shoppingList: shoppingList.ShoppingListState;
  recipes: recipes.RecipeState;
}

const appReducer: ActionReducerMap<AppState> = {
  auth: auth.authReducer,
  shoppingList: shoppingList.shoppingListReducer,
  recipes: recipes.recipeRecuder,
};

export default appReducer;
