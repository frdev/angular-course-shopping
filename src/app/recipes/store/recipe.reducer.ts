import { createReducer, on } from "@ngrx/store";
import { Recipe } from "../recipe.model";
import {
  RecipesAdd,
  RecipesDelete,
  RecipesLoadError,
  RecipesLoadStart,
  RecipesLoadSuccess,
  RecipesUpdate,
} from "./recipe.actions";

export interface RecipeState {
  recipes: Recipe[];
  loading: boolean;
  error: string;
}

export const INITIAL_STATE: RecipeState = {
  recipes: [],
  loading: false,
  error: null,
};

export const recipeRecuder = createReducer(
  INITIAL_STATE,
  on(RecipesLoadStart, (state) => ({ ...state, loading: true, error: null })),
  on(RecipesLoadSuccess, (state, { recipes }) => {
    return { ...state, recipes: [...recipes], loading: false, error: null };
  }),
  on(RecipesLoadError, (state, { error }) => {
    return { ...state, loading: false, error };
  }),
  on(RecipesAdd, (state, { recipe }) => {
    const newRecipe = {
      ...recipe,
      id: state.recipes.length + 1,
    };

    return {
      ...state,
      recipes: [...state.recipes, newRecipe],
    };
  }),
  on(RecipesUpdate, (state, { recipe }) => {
    const index = state.recipes.findIndex(({ id }) => id === recipe.id);

    const updatedRecipe = { ...state.recipes[index], ...recipe };

    const updatedRecipes = [...state.recipes];

    updatedRecipes[index] = updatedRecipe;

    return { ...state, recipes: updatedRecipes };
  }),
  on(RecipesDelete, (state, { id }) => {
    return {
      ...state,
      recipes: state.recipes.filter((recipe) => recipe.id !== id),
    };
  })
);
