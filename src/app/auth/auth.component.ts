import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Subject } from "rxjs";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";
import { take, takeUntil } from "rxjs/operators";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { ClearError, SignInStart, SignUpStart } from "./store/auth.actions";

@Component({
  selector: "app-auth",
  templateUrl: "./auth.component.html",
  styleUrls: ["./auth.component.css"],
})
export class AuthComponent implements OnInit, OnDestroy {
  isLoginMode = true;
  isLoading = false;
  error: string = null;

  @ViewChild(PlaceholderDirective, { static: true })
  alertHost: PlaceholderDirective;
  $destroy: Subject<boolean> = new Subject<boolean>();

  constructor(
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver,
    private store: Store<AppState>
  ) {}

  ngOnInit(): void {
    this.store
      .select("auth")
      .pipe(takeUntil(this.$destroy))
      .subscribe(({ user, loading, error }) => {
        this.isLoading = loading;
        this.error = error;

        if (!user || error) return;

        this.router.navigate(["/recipes"]);
      });
  }

  ngOnDestroy(): void {
    this.$destroy.next();
    this.$destroy.complete();
  }

  onSwitchMode() {
    this.isLoginMode = !this.isLoginMode;
  }

  onSubmit(form: NgForm) {
    if (form.invalid) return;

    this.isLoading = true;
    this.error = null;

    const eventDispatch = this.isLoginMode ? SignInStart : SignUpStart;

    this.store.dispatch(eventDispatch({ credentials: form.value }));

    form.reset();
  }

  onHandleError() {
    this.store.dispatch(ClearError());
  }

  private showErrorAlert(message: string) {
    // const alertComponent = new AlertComponent();
    const alertComponentFactory =
      this.componentFactoryResolver.resolveComponentFactory(AlertComponent);

    const hostViewContainerRef = this.alertHost.viewContainerRef;
    hostViewContainerRef.clear();

    const alertComponentRef = hostViewContainerRef.createComponent(
      alertComponentFactory
    );

    alertComponentRef.instance.message = message;
    alertComponentRef.instance.close
      .pipe(take(1), takeUntil(this.$destroy))
      .subscribe(() => {
        hostViewContainerRef.clear();
      });
  }
}

//https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser?key=[API_KEY]
