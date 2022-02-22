import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Recipe } from "../recipes/recipe.model";
import { map, tap } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { RecipesLoadSuccess } from "../recipes/store/recipe.actions";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class DataStorageService {
  constructor(private http: HttpClient, private store: Store<AppState>) {}

  storeRecipes(recipes: Recipe[]) {
    return this.http.put(
      "https://prj-shopping-default-rtdb.firebaseio.com/recipes.json",
      recipes
    );
  }

  fetchRecipes(): Observable<Recipe[]> {
    return this.http
      .get<Recipe[]>(
        "https://prj-shopping-default-rtdb.firebaseio.com/recipes.json"
      )
      .pipe(
        map((recipes) => {
          return recipes.map((recipe) => ({
            ...recipe,
            ingredients: recipe.ingredients ? recipe.ingredients : [],
          }));
        }),
        tap((recipes) => {
          // this.recipeService.setRecipes(recipes);
          this.store.dispatch(RecipesLoadSuccess({ recipes }));
        })
      );
  }
}
