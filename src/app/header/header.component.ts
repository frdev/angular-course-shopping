import { Component, OnDestroy, OnInit } from "@angular/core";
import { Store } from "@ngrx/store";
import { Subject } from "rxjs";
import { takeUntil } from "rxjs/operators";
import { SignOut } from "../auth/store/auth.actions";
import {
  RecipesLoadStart,
  RecipesStore,
} from "../recipes/store/recipe.actions";
import { AppState } from "../store/app.reducer";

@Component({
  selector: "app-header",
  templateUrl: "./header.component.html",
})
export class HeaderComponent implements OnInit, OnDestroy {
  $destroy: Subject<boolean> = new Subject<boolean>();

  authenticated = false;

  constructor(private store: Store<AppState>) {}

  ngOnInit() {
    this.store
      .select("auth")
      .pipe(takeUntil(this.$destroy))
      .subscribe(({ user }) => {
        this.authenticated = user && !!user.token;
      });
  }

  ngOnDestroy() {
    this.$destroy.next();
    this.$destroy.complete();
  }

  onSaveData() {
    this.store.dispatch(RecipesStore());
  }

  onFetchData() {
    this.store.dispatch(RecipesLoadStart());
  }

  onSignOut() {
    this.store.dispatch(SignOut());
  }
}
