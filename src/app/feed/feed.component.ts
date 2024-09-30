import { Component, inject } from '@angular/core';
import { getToken, Messaging, onMessage } from '@angular/fire/messaging';
import { MatButtonModule } from '@angular/material/button';
import { MatListModule } from '@angular/material/list';
import { MatSidenavModule } from '@angular/material/sidenav';
import { RouterModule } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { AuthService } from '../shared/services/auth.service';

@Component({
  selector: 'app-feed',
  standalone: true,
  imports: [
    HeaderComponent,
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './feed.component.html',
  styleUrl: './feed.component.scss',
})
export class FeedComponent {
  opened = false;

  private readonly _messaging = inject(Messaging);
  authService = inject(AuthService);

  ngOnInit(): void {
    this._getDeviceToken();
    this._onMessage();
  }

  logout() {
    this.authService.logout();
  }

  private _getDeviceToken(): void {
    getToken(this._messaging, {
      vapidKey:
        'BFi_Z957BLCN1VjtgklwY9trxV3hzQrSSNnrgMxU2zpqWFxLjzs6v2vPu2qWRQTbdZPA8-MxISQK253bZxkahos',
    })
      .then((token) => {
        console.log(token);
        // save the token in the server, or do whathever you want
      })
      .catch((error) => console.log('Token error', error));
  }

  private _onMessage(): void {
    onMessage(this._messaging, {
      next: (payload) => console.log('Message', payload),
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }
}
