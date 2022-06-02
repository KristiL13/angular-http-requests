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

    // request ise on immutable. Aga võin siin luua uue ja saata päringu sellega nt.
    // clone'i sees saan muuta kõiki olulisi asju.
    console.log(request.url);
    const modifiedRequest = request.clone({
      // url: 'some-new-url',
      // kui tahan lisada olemasolevale headerile midagi, siis nii:
      headers: request.headers.append('Auth', 'asi'),
      // võiksin siin ka hoopis uue headeri teha
      // või parameetreid lisada...
      // params: 
    });
    return next.handle(modifiedRequest);
    // Kui tahan muuta headerit nt ainult teatud tingimustel, võin muuta seda nt
    // kasutades ifi ja urli väärtust.

    // return next.handle(request); // calling next with the request object is necessary
    // to let the request continue. And I need to return the result to REALLY let it
    // continue.
  }
}