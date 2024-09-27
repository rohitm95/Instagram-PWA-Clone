import { Component, inject } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HeaderComponent } from './shared/header/header.component';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatListModule } from '@angular/material/list';
import { MatButtonModule } from '@angular/material/button';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { SwUpdate } from '@angular/service-worker';
import { scheduled, asyncScheduler, tap } from 'rxjs';

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
  swUpdate = inject(SwUpdate);

  ngOnInit(): void {
    this._getDeviceToken();
    this._onMessage();
    if (this.swUpdate.isEnabled) {
      scheduled(this.swUpdate.checkForUpdate(), asyncScheduler).pipe(
        tap(() => {
          if (confirm("New version available. Load new version?")) {
            window.location.reload();
          }
        })
      )
    }
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
