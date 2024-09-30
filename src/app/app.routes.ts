import { Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { CreatePostComponent } from './create-post/create-post.component';
import { NotFoundComponent } from './not-found/not-found.component';
import { authGuard } from './shared/services/auth.guard';
import { PostsListComponent } from './feed/posts-list/posts-list.component';
import { LoginComponent } from './login/login.component';
import { SignupComponent } from './signup/signup.component';

export const routes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'signup', component: SignupComponent },
  {
    path: '',
    component: FeedComponent,
    children: [
      { path: '', redirectTo: 'posts', pathMatch: 'full' },
      { path: 'posts', component: PostsListComponent },
      { path: 'help', component: HelpPageComponent },
      { path: 'create-post', component: CreatePostComponent },
    ],
    canActivate: [authGuard],
  },

  { path: '**', component: NotFoundComponent },
];
