import { Component, inject, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { AuthService } from '../shared/services/auth.service';
import { MessagingService } from '../shared/services/messaging.service';


@Component({
    selector: 'app-feed',
    imports: [
        HeaderComponent,
        MatSidenavModule,
        RouterModule,
        MatListModule,
        MatButtonModule,
    ],
    templateUrl: './feed.component.html',
    styleUrl: './feed.component.scss'
})
export class FeedComponent implements OnInit {
  opened = false;

  authService = inject(AuthService);
  messagingService = inject(MessagingService);

  ngOnInit(): void {
    this._getDeviceToken();
    this._onMessage();
  }

  logout() {
    this.authService.logout();
  }

  private _getDeviceToken(): void {
    this.messagingService.getDeviceToken().subscribe({
      next: (token) => console.log(token),
      error: (error) => console.log('Token error', error),
    });
  }

  private _onMessage(): void {
    this.messagingService.listenForMessages();
  }
}
