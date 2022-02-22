import { isPlatformBrowser } from "@angular/common";
import { Component, OnInit, Inject, PLATFORM_ID } from "@angular/core";
import { Store } from "@ngrx/store";
import { SignInAuto } from "./auth/store/auth.actions";
import { LoggingService } from "./logging.service";
import { AppState } from "./store/app.reducer";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent implements OnInit {
  constructor(
    private store: Store<AppState>,
    private loggingService: LoggingService,
    @Inject(PLATFORM_ID) private platformId
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) this.store.dispatch(SignInAuto());

    this.loggingService.printLog("Hello from AppComponent ngOnInit");
  }
}
