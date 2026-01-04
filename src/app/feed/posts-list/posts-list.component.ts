import { DatePipe, NgOptimizedImage } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { Post } from '../../shared/post.model';
import { DataService } from '../../shared/services/data.service';
import { SnackbarService } from '../../shared/services/snackbar.service';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { Router, RouterModule } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { MatMenuModule } from '@angular/material/menu';

@Component({
    selector: 'app-posts-list',
    imports: [
        MatCardModule,
        DatePipe,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        NgOptimizedImage,
        MatMenuModule,
    ],
    templateUrl: './posts-list.component.html',
    styleUrl: './posts-list.component.scss'
})
export class PostsListComponent implements AfterViewInit {
  @ViewChildren('postImage') postImages: QueryList<
    ElementRef<HTMLImageElement>
  >;
  dataService = inject(DataService);
  snackbarService = inject(SnackbarService);
  data: Post[] = [];
  router = inject(Router);
  auth = inject(Auth);
  authState$ = authState(this.auth);
  userDetails;

  ngAfterViewInit(): void {
    this.getAllPosts();
  }

  getAllPosts() {
    this.authState$.subscribe((user) => {
      this.userDetails = user;
      if (user) {
        this.dataService.fetchUserPosts(user.uid).subscribe({
          next: (querySnapshot) => {
            let docs = querySnapshot.docs;
            const availablePosts = docs.map((doc) => {
              return {
                id: doc.id,
                title: doc.data()['title'],
                location: doc.data()['location'],
                date: doc.data()['date'],
                image: doc.data()['image'],
              };
            });
            this.data = availablePosts;
          },
          error: (error) => {
            this.snackbarService.showSnackbar(
              'Error fetching posts',
              null,
              3000
            );
          },
        });
      }
    });
  }

  onImageError() {
    this.postImages.forEach((image) => {
      image.nativeElement.src = 'images/broken-image.webp';
    });
  }

  addNewPost() {
    this.router.navigate(['create-post']);
  }
}
