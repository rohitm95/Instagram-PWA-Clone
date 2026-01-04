import { Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './shared/services/auth.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () =>
      import('./login/login.component').then((c) => c.LoginComponent),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./signup/signup.component').then((c) => c.SignupComponent),
  },
  {
    path: '',
    component: FeedComponent,
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      {
        path: 'posts',
        loadComponent: () =>
          import('./feed/posts-list/posts-list.component').then(
            (c) => c.PostsListComponent
          ),
      },
      {
        path: 'help',
        loadComponent: () =>
          import('./help-page/help-page.component').then(
            (c) => c.HelpPageComponent
          ),
      },
      {
        path: 'create-post',
        loadComponent: () =>
          import('./create-post/create-post.component').then(
            (c) => c.CreatePostComponent
          ),
      },
      {
        path: 'create-post/:id',
        loadComponent: () =>
          import('./create-post/create-post.component').then(
            (c) => c.CreatePostComponent
          ),
      },
    ],
    canActivate: [authGuard],
  },

  { path: '**', component: NotFoundComponent },
];
