import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

import { StoreModule } from "@ngrx/store";
import appReducer from "./store/app.reducer";

import { EffectsModule } from "@ngrx/effects";
import { AuthEffects } from "./auth/store/auth.effects";

import { StoreDevtoolsModule } from "@ngrx/store-devtools";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";
import { environment } from "src/environments/environment";
import { StoreRouterConnectingModule } from "@ngrx/router-store";
import { RecipeEffects } from "./recipes/store/recipe.effects";

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule.withServerTransition({ appId: 'serverApp' }),
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    StoreModule.forRoot(appReducer),
    EffectsModule.forRoot([AuthEffects, RecipeEffects]),
    StoreRouterConnectingModule.forRoot(),
    StoreDevtoolsModule.instrument({ logOnly: !environment.production }),
    SharedModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
