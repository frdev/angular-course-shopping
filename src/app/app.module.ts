import { NgModule } from "@angular/core";
import { BrowserModule } from "@angular/platform-browser";
import { HttpClientModule } from "@angular/common/http";

// import { StoreModule } from "@ngrx/store";
// import shoppingListReducer from "./shopping-list/store/shopping-list.reducer";

import { CoreModule } from "./core/core.module";
import { SharedModule } from "./shared/shared.module";
import { AppRoutingModule } from "./app-routing.module";

import { AppComponent } from "./app.component";
import { HeaderComponent } from "./header/header.component";

@NgModule({
  declarations: [AppComponent, HeaderComponent],
  imports: [
    BrowserModule,
    HttpClientModule,
    AppRoutingModule,
    CoreModule,
    // StoreModule.forRoot({
    //   shoppingList: shoppingListReducer,
    // }),
    SharedModule,
  ],
  // providers: [LoggingService],
  bootstrap: [AppComponent],
})
export class AppModule {}
