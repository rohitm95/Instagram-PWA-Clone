import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    HeaderComponent,
    MatSidenavModule,
    RouterModule,
    MatListModule,
    MatButtonModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PWA-gram';
  opened = false;

  private readonly _messaging = inject(Messaging);

  ngOnInit(): void {
    this._getDeviceToken();
    this._onMessage();
  }

  private _getDeviceToken(): void {
    getToken(this._messaging, {
      vapidKey:
        'BGgWffgRWDYpk9crlRuB_tjQo0RGNIE9o3nUQ2DEsHm_aFhCl8VqcRV0E7KDmasxX3D781vG4mmsyxSHlPULHeQ',
    })
      .then((token) => {
        // console.log(token);
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
