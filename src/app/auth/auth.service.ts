import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Router } from "@angular/router";
import { Observable } from "rxjs";
import { environment } from "../../environments/environment";
import { Store } from "@ngrx/store";
import { AppState } from "../store/app.reducer";
import { SignOut } from "./store/auth.actions";

interface AuthRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  kind: string;
  idToken: string;
  email: string;
  refreshToken: string;
  expiresIn: string;
  localId: string;
  registered?: boolean;
}

@Injectable({ providedIn: "root" })
export class AuthService {
  private tokenExpirationTimer: any;

  constructor(
    private http: HttpClient,
    private router: Router,
    private store: Store<AppState>
  ) {}

  signUp({ email, password }: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/signupNewUser",
      {
        email,
        password,
        returnSecureToken: true,
      },
      {
        params: {
          key: environment.firebaseAPIKey,
        },
      }
    );
  }

  signIn({ email, password }: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      "https://www.googleapis.com/identitytoolkit/v3/relyingparty/verifyPassword",
      {
        email,
        password,
        returnSecureToken: true,
      },
      {
        params: {
          key: environment.firebaseAPIKey,
        },
      }
    );
  }

  autoSignOut(expiration: number) {
    this.tokenExpirationTimer = setTimeout(() => {
      this.store.dispatch(SignOut());
    }, expiration);
  }

  clearAutoSignOut() {
    if (this.tokenExpirationTimer) {
      clearTimeout(this.tokenExpirationTimer);
      this.tokenExpirationTimer = null;
    }
  }
}
