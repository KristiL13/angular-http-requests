import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subject, throwError } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
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
      postData
    ).subscribe({
      next: responseData => {
        console.log(responseData);
      },
      error: error => {
        this.error.next(error.message);
      }
    });
  }

  fetchPosts() {
    // here i will send my request
    // get has only one argument, because there is no request Body.
    // Peab subscribeima ikka ka, muidu päringut ei saadeta.
    // Selline [key: string] väljend [] sees tähendab, et see on mingi
    // random string, millel pole nime.
    // Set up the Observable in the service, but subscribe in the component.
    return this.http
      // get järel <> sees saab ette anda vastuse Body tüübi TSle.
      .get<{ [key: string]: Post }>('https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
      // map tagastab ka Observable-i, seega saame subscribeida all pool.
      .pipe(
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
          // vana:
          // return throwError(errorResponse);
          // uus:
          return throwError(() => new Error(errorResponse));
        })
      );
  }

  deletePosts() {
    return this.http.delete('https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json');
  }
}
