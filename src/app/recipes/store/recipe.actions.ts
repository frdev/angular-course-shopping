import { createAction, props } from "@ngrx/store";
import { Recipe } from "../recipe.model";

export enum RecipeTypeActions {
  RECIPES_LOAD_START = "[Recipes] Load Start",
  RECIPES_LOAD_SUCCESS = "[Recipes] Load Success",
  RECIPES_LOAD_ERROR = "[Recipes] Load Error",
  RECIPES_ADD = "[Recipes] Add",
  RECIPES_UPDATE = "[Recipes] Update",
  RECIPES_DELETE = "[Recipes] Delete",
  RECIPES_STORE = "[Recipes] Store",
}
export const RecipesLoadStart = createAction(
  RecipeTypeActions.RECIPES_LOAD_START
);

export const RecipesLoadSuccess = createAction(
  RecipeTypeActions.RECIPES_LOAD_SUCCESS,
  props<{ recipes: Recipe[] }>()
);

export const RecipesLoadError = createAction(
  RecipeTypeActions.RECIPES_LOAD_ERROR,
  props<{ error: string }>()
);

export const RecipesAdd = createAction(
  RecipeTypeActions.RECIPES_ADD,
  props<{ recipe: Recipe }>()
);

export const RecipesUpdate = createAction(
  RecipeTypeActions.RECIPES_UPDATE,
  props<{ recipe: Recipe }>()
);

export const RecipesDelete = createAction(
  RecipeTypeActions.RECIPES_DELETE,
  props<{ id: number }>()
);

export const RecipesStore = createAction(RecipeTypeActions.RECIPES_STORE);
