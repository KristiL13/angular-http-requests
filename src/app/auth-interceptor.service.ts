import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

export class AuthInterceptorService implements HttpInterceptor {
  // This is a function that will forward the request and response:
  // it will run code before the request will leave my app, and right
  // before the response is sent to subscribe. next is called to
  // forward the request.
  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    // Kui ma ikkagi ei taha pärast iga päringuga seda intercepti sisu rakendada,
    // siis siin saan kirjutada nt tingimusi, mille puhul seda teha või mitte. nt:
    if (request.url === 'https://mingi.lambi.aadress') {
      console.log('siis ära tee intercepti või selle mingit osa, või just tee');
    }

    console.log('request is on its way');
    return next.handle(request); // calling next with the request object is necessary
    // to let the request continue. And I need to return the result to REALLY let it
    // continue.
  }
}