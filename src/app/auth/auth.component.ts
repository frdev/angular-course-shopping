import {
  Component,
  ComponentFactoryResolver,
  OnDestroy,
  OnInit,
  ViewChild,
} from "@angular/core";
import { NgForm } from "@angular/forms";
import { Router } from "@angular/router";
import { Observable, Subject, Subscription } from "rxjs";
import { AuthResponse, AuthService } from "./auth.service";
import { AlertComponent } from "../shared/alert/alert.component";
import { PlaceholderDirective } from "../shared/placeholder.directive";
import { take, takeUntil } from "rxjs/operators";

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
    private authService: AuthService,
    private router: Router,
    private componentFactoryResolver: ComponentFactoryResolver
  ) {}

  ngOnInit(): void {}

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

    let authObservable: Observable<AuthResponse> = !this.isLoginMode
      ? this.authService.signUp(form.value)
      : this.authService.signIn(form.value);

    authObservable.subscribe(
      () => {
        this.isLoading = false;
        this.router.navigate(["/recipes"]);
      },
      (error) => {
        this.error = error;
        this.showErrorAlert(error);
        this.isLoading = false;
      }
    );

    form.reset();
  }

  onHandleError() {
    this.error = null;
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
