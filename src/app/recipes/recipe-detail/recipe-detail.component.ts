import { Component, OnInit, OnDestroy } from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { map, switchMap, takeUntil, tap } from "rxjs/operators";
import { AddIngredients } from "src/app/shopping-list/store/shopping-list.actions";
import { AppState } from "src/app/store/app.reducer";

import { Recipe } from "../recipe.model";
import { RecipesDelete } from "../store/recipe.actions";

@Component({
  selector: "app-recipe-detail",
  templateUrl: "./recipe-detail.component.html",
  styleUrls: ["./recipe-detail.component.css"],
})
export class RecipeDetailComponent implements OnInit, OnDestroy {
  id: number;
  recipe: Recipe;

  private $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private store: Store<AppState>
  ) {
    this.route.params
      .pipe(
        takeUntil(this.$destroy),
        tap(({ id }) => {
          this.id = +id;
        }),
        switchMap(() => this.store.select("recipes")),
        map(({ recipes }) => recipes.find(({ id }) => +this.id === id))
      )
      .subscribe((recipe) => {
        this.recipe = recipe;
      });
  }

  ngOnInit() {}

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  onAddToShoppingList() {
    this.store.dispatch(new AddIngredients(this.recipe.ingredients));
  }

  onDeleteRecipe() {
    this.store.dispatch(RecipesDelete({ id: this.id }));

    this.router.navigate([".."], { relativeTo: this.route });
  }
}
