import { Routes } from '@angular/router';
import { FeedComponent } from './feed/feed.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { CreatePostComponent } from './create-post/create-post.component';

export const routes: Routes = [
    { path: 'feed', component: FeedComponent },
    { path: 'help', component: HelpPageComponent },
    { path: 'create-post', component: CreatePostComponent },
    { path: '', component: FeedComponent }
];
