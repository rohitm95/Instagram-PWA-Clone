import { AsyncPipe, DatePipe, JsonPipe, NgOptimizedImage } from '@angular/common';
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
import { GeoapifyService } from '../../shared/services/geoapify.service';

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
        AsyncPipe,
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
  geoapifyService = inject(GeoapifyService);

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
              const availablePosts: Post[] = docs.map((doc) => {
                const data = doc.data() as any;
                return {
                  id: doc.id,
                  title: data.title,
                  location: data.location,
                  date: data.date,
                  image: data.image,
                  address$: this.geoapifyService.getAddress(data.location.lat, data.location.lng)
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

  deletePost(post: Post) {
    this.dataService.deletePost(post.id).subscribe({
      next: () => {
        this.snackbarService.showSnackbar('Post deleted successfully', null, 3000);
        this.getAllPosts();
      },
      error: (error) => {
        this.snackbarService.showSnackbar('Error deleting post', null, 3000);
      },
    });
  }

  editPost(post: Post) {
    this.router.navigate(['create-post', post.id]);
  }


}
