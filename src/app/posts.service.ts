import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError, tap } from 'rxjs/operators';
import { Post } from './post.model';

@Injectable({
  providedIn: 'root' // moodsam provideimise lahendus
})
export class PostsService {
  error = new Subject<string>();

  constructor(private http: HttpClient) {}

  createAndStorePost(title: string, content: string) {
    // If the component doesn't care about the response,
    // then there is no reason to subscribe to it in the component.
    const postData: Post = {title: title, content: content}
    // here i will send my post
    // http requests are wrapped by Observables. You need to subscribe to it.
    // Muidu Angular arvab, et keegi pole vastusest huvitatud ja ei saada isegi päringut.
    // Kõigi päringute puhul saab määrata vastuse Body tüübi ka.
    // See annab ka edasi vastuse töötlemise juures parema autocompletioni.

    this.http.post<{ name: string }>(
      // Siin .json on API aadressi lõpus, lihtsalt kuna Firebaseil endal on nii vaja
      'https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      // Siin Angulari HttpClient teeb meie JS objektist ise JSONi ja saadab JSON datat.
      postData,
      {
        // Siin määran, millist vastust tahan.
        // body tähendab, et ainult response body, ehk data objekt.
        // observe: 'body'
        observe: 'response' // kogu vastus, koos headeri, statuse jnega
      }
    ).subscribe({
      next: responseData => {
        console.log(responseData);
        console.log(responseData.body); // kui observe: 'response' puhul tahaks sama
        // asja logida nagu enne.
      },
      error: error => {
        this.error.next(error.message);
      }
    });
  }

  fetchPosts() {
    // Teine variant parameetrite lisamiseks:
    let searchParams = new HttpParams();
    searchParams = searchParams.append('print', 'pretty'); // response on ilusam
    searchParams = searchParams.append('custom', 'key'); // see ei tee midagi Firebaseis
    // jne
    // here i will send my request
    // get has only one argument, because there is no request Body.
    // Peab subscribeima ikka ka, muidu päringut ei saadeta.
    // Selline [key: string] väljend [] sees tähendab, et see on mingi
    // random string, millel pole nime.
    // Set up the Observable in the service, but subscribe in the component.
    return this.http
      // get järel <> sees saab ette anda vastuse Body tüübi TSle.
      .get<{ [key: string]: Post }>('https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
        // siin saan confida oma päringut, s.h. määrata custom headerit.
        {
          headers: new HttpHeaders({ 'Custom-Header': 'Hello' }),
          // adding query parameters
          // teine meetod:
          params: searchParams
          // esimene meetod:
          // params: new HttpParams().set('print', 'pretty') // this sets how
          // Firebase returns it's data. Selle oleks võinud muidugi panna ise
          // ka üles urli lõppu, sest params nüüd paneb ta ka sinna.
          // sama kui panna ?print=pretty&key=value jne urli lõppu. Siin nii on ilusam.
        }
      )
      .pipe(
        // map tagastab ka Observable-i, seega saame subscribeida all pool.
        map(responseData => {
          const postsArray: Post[] = [];
          for (const key in responseData) {
            if (responseData.hasOwnProperty(key)) {
              // Teeme uue objekti saadud data käesolevale key-le vastavast objektist
              // ning saame ka lisada lisa key-value paare.
              postsArray.push({...responseData[key], id: key});
            }
          }
          return postsArray;
        }),
        // Siin saame täpselt sama vea info, mida subscribeimisel saab.
        catchError(errorResponse => {
          // Siin on võimalik ka kasutada Subjectit ja teha .next errormessagega.
          // Aga siin võib ka hoopis saata veateate nt analüütika serverisse, logida vmt.
          // Samas see tuleb pärast tagasi anda, nii nagu mapis tuleb midagi tagastada.
          // throwError tekitab uue Observablei wrappides errorit.
          // Kasulik kasutada eriti, kui on vaja teha midagi nt backis või mujal ka veaga.
          // vana:
          // return throwError(errorResponse);
          // uus:
          return throwError(() => new Error(errorResponse));
        })
      );
  }

  deletePosts() {
    return this.http.delete(
      'https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      {
        observe: 'events'
      }
      ).pipe(
        tap(event => {
          console.log(event);
        })
      );
  }
}
