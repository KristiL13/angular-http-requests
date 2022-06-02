import { HttpEvent, HttpEventType, HttpHandler, HttpInterceptor, HttpRequest } from "@angular/common/http";
import { Observable, tap } from "rxjs";

export class LoggingInterceptorService implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    console.log('Outgoing request url:');
    console.log(req.url);
    // Kuna app.module failis LoggingInterceptor on teisel kohal, siis siin headers
    // logides näeme, et headers on juba AuthInterceptori poolt ära muudetud: lisatud auth.
    console.log(req.headers);
    return next.handle(req).pipe(tap(event => {
      if (event.type === HttpEventType.Response) {
        console.log('Incoming response body:');
        console.log(event.body);
      }
    }));
  }
}