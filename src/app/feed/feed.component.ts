import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  QueryList,
  ViewChildren,
} from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import {
  MatDialog,
  MatDialogModule,
} from '@angular/material/dialog';
import { MatCardModule } from '@angular/material/card';
import { DataService } from '../shared/data.service';
import { SnackbarService } from '../shared/snackbar.service';
import { Post } from '../shared/post.model';
import { Router, RouterModule } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    MatIconModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    RouterModule,
    DatePipe,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent implements AfterViewInit {
  @ViewChildren('postImage') postImages: QueryList<ElementRef<HTMLImageElement>>;
  dialog = inject(MatDialog);
  data: Post[] = [];
  dataService = inject(DataService);
  snackbarService = inject(SnackbarService);
  router = inject(Router);

  ngAfterViewInit(): void {
    this.getAllPosts();
    this.onImageError();
  }

  addNewPost() {
    this.router.navigate(['create-post']);
  }

  getAllPosts() {
    this.dataService.fetchAvailablePosts().subscribe({
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
        this.snackbarService.showSnackbar('Error fetching posts', null, 3000);
      },
    });
  }

  onImageError() {
    this.postImages.forEach((image) => {
      image.nativeElement.src = 'images/broken-image.png';
    })
  }
}
