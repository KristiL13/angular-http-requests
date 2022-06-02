import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AppComponent } from './app.component';
import { AuthInterceptorService } from './auth-interceptor.service';
import { LoggingInterceptorService } from './logging-interceptor.service';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule // seda ongi vaja http requestide jaoks
  ],
  providers: [
    // The order in which you provide the interceptors matters,
    // because that is the order in which they will be executed.
    {
      provide: HTTP_INTERCEPTORS, // This is the token by which this injection can
      // later be identified by Angular, so it will basically know that all the classes
      // you provide on that token, so by using that identifier, should be treated as
      // HTTP interceptors and should therefore run their intercept method whenever
      // a request leaves the application.
      // useClass: siin viitan klassile, millist tahan interceptorina lisada.
      useClass: AuthInterceptorService,
      multi: true // Ära sõida olemasolevaid interceptoreid sellega üle.
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: LoggingInterceptorService,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {}
