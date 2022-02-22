import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpParams,
  HttpRequest,
} from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Store } from "@ngrx/store";
import { Observable } from "rxjs";
import { exhaustMap, take } from "rxjs/operators";
import { AppState } from "../store/app.reducer";

@Injectable({
  providedIn: "root",
})
export class AuthInterceptorService implements HttpInterceptor {
  constructor(private store: Store<AppState>) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store.select("auth").pipe(
      take(1),
      exhaustMap(({ user }) => {
        if (!user) return next.handle(req);

        const modifiedRequest = req.clone({
          params: new HttpParams().set("auth", user.token),
        });

        return next.handle(modifiedRequest);
      })
    );
  }
}
