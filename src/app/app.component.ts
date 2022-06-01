import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { Post } from './post.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  loadedPosts = [];

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.fetchPosts();
  }

  onCreatePost(postData: Post) {
    // Send Http request
    console.log(postData);
    // http requests are wrapped by Observables. You need to subscribe to it.
    // Muidu Angular arvab, et keegi pole vastusest huvitatud ja ei saada isegi päringut.
    this.http.post(
      // Siin .json on API aadressi lõpus, lihtsalt kuna Firebaseil endal on nii vaja
      'https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json',
      // Siin Angulari HttpClient teeb meie JS objektist ise JSONi ja saadab JSON datat.
      postData
    ).subscribe(responseData => {
      console.log(responseData);
    });
  }

  onFetchPosts() {
    this.fetchPosts();
  }

  onClearPosts() {
    // Send Http request
  }

  private fetchPosts() {
    // get has only one argument, because there is no request Body.
    // Peab subscribeima ikka ka, muidu päringut ei saadeta.
    this.http.get('https://ng-complete-guide-408bf-default-rtdb.europe-west1.firebasedatabase.app/posts.json')
    // map tagastab ka Observable-i, seega saame subscribeida all pool.
      .pipe(map((responseData: { [key: string]: Post }) => {
        const postsArray: Post[] = [];
        for (const key in responseData) {
          if (responseData.hasOwnProperty(key)) {
            // Teeme uue objekti saadud data käesolevale key-le vastavast objektist
            // ning saame ka lisada lisa key-value paare.
            postsArray.push({...responseData[key], id: key});
          }
          return postsArray;
        }
      }))
      .subscribe(posts => {
        console.log(posts);
      });
  }
}
