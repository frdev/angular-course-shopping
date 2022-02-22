import { Injectable } from "@angular/core";

import {
  ActivatedRouteSnapshot,
  Resolve,
  RouterStateSnapshot,
} from "@angular/router";
import { Actions, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { Observable, of } from "rxjs";
import { map, switchMap, take } from "rxjs/operators";
import { AppState } from "../store/app.reducer";

import { Recipe } from "./recipe.model";
import { RecipesLoadStart, RecipesLoadSuccess } from "./store/recipe.actions";

@Injectable({ providedIn: "root" })
export class RecipesResolverService implements Resolve<Recipe[]> {
  constructor(private store: Store<AppState>, private actions$: Actions) {}

  resolve(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Recipe[] | Observable<Recipe[]> | Promise<Recipe[]> {
    return this.store.select("recipes").pipe(
      take(1),
      switchMap(({ recipes }) => {
        if (recipes.length) return of(recipes);

        this.store.dispatch(RecipesLoadStart());

        return this.actions$.pipe(
          ofType(RecipesLoadSuccess),
          map(({ recipes }) => recipes),
          take(1)
        );
      })
    );
  }
}
