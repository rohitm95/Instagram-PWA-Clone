import { Injectable, inject } from '@angular/core';
import { Messaging, getToken, onMessage } from '@angular/fire/messaging';
import { Observable, from } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MessagingService {
  private readonly _messaging = inject(Messaging);

  getDeviceToken(): Observable<string | null> {
    return from(
      getToken(this._messaging, {
        vapidKey:
          'BFi_Z957BLCN1VjtgklwY9trxV3hzQrSSNnrgMxU2zpqWFxLjzs6v2vPu2qWRQTbdZPA8-MxISQK253bZxkahos',
      })
    );
  }

  listenForMessages(): void {
    onMessage(this._messaging, {
      next: (payload) => console.log('Message', payload),
      error: (error) => console.log('Message error', error),
      complete: () => console.log('Done listening to messages'),
    });
  }
}
