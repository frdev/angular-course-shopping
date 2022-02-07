import { Injectable } from "@angular/core";
import { Subject } from "rxjs";
import { Ingredient } from "../shared/ingredient.model";
import { Recipe } from "./recipe.model";

@Injectable({
  providedIn: "root",
})
export class RecipeService {
  recipesChanged = new Subject<Recipe[]>();

  private recipes: Recipe[] = [
    new Recipe(
      1,
      "A Test Recipe",
      "This is simply a test",
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg",
      [new Ingredient("Meat", 1), new Ingredient("French Fries", 20)]
    ),
    new Recipe(
      2,
      "Big Fat Burger",
      "This is simply a test",
      "https://upload.wikimedia.org/wikipedia/commons/1/15/Recipe_logo.jpeg",
      [new Ingredient("Buns", 2), new Ingredient("Meat", 1)]
    ),
  ];

  constructor() {}

  getRecipes() {
    return this.recipes.slice();
  }

  getRecipe(id: number) {
    return this.recipes.find((recipe) => recipe.id === id);
  }

  addRecipe(recipe: Recipe) {
    recipe.id = this.recipes.length + 1;

    this.recipes.push(recipe);

    this.recipesChanged.next(this.getRecipes());
  }

  updateRecipe(recipe: Recipe) {
    const index = this.recipes.findIndex(({ id }) => id === recipe.id);

    this.recipes[index] = recipe;

    this.recipesChanged.next(this.getRecipes());
  }

  deleteRecipe(id: number) {
    const index = this.recipes.findIndex((recipe) => recipe.id === id);

    this.recipes.splice(index, 1);

    this.recipesChanged.next(this.getRecipes());
  }
}
