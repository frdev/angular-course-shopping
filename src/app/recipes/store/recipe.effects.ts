import { Injectable } from "@angular/core";
import { Actions, createEffect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, exhaustMap, map, take, tap } from "rxjs/operators";
import { DataStorageService } from "src/app/shared/data-storage.service";
import { AppState } from "src/app/store/app.reducer";
import {
  RecipesLoadError,
  RecipesLoadStart,
  RecipesLoadSuccess,
  RecipesStore,
} from "./recipe.actions";

@Injectable()
export class RecipeEffects {
  fetchRecipes$ = createEffect(() => {
    return this.$actions.pipe(
      ofType(RecipesLoadStart),
      exhaustMap(() => {
        return this.dataStorageService.fetchRecipes().pipe(
          map((recipes) => RecipesLoadSuccess({ recipes })),
          catchError(() =>
            of(RecipesLoadError({ error: "An unknown error ocurred" }))
          )
        );
      })
    );
  });

  storeRecipes$ = createEffect(
    () => {
      return this.$actions.pipe(
        ofType(RecipesStore),
        exhaustMap(() => {
          return this.store.select("recipes").pipe(
            take(1),
            tap(({ recipes }) => {
              this.dataStorageService
                .storeRecipes(recipes)
                .pipe(take(1))
                .subscribe();
            })
          );
        })
      );
    },
    {
      dispatch: false,
    }
  );

  constructor(
    private $actions: Actions,
    private store: Store<AppState>,
    private dataStorageService: DataStorageService
  ) {}
}
