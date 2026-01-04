import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ScreenObserverService } from '../services/screen-observer-service';
import { AuthService } from '../services/auth.service';
import { AsyncPipe } from '@angular/common';

@Component({
    selector: 'app-header',
    imports: [
        MatToolbarModule,
        MatIconModule,
        MatButtonModule,
        RouterModule,
        AsyncPipe,
    ],
    templateUrl: './header.component.html',
    styleUrl: './header.component.scss'
})
export class HeaderComponent {
  @Output() sidenav: EventEmitter<any> = new EventEmitter();
  screenObserver = inject(ScreenObserverService);
  isMobile = this.screenObserver.updateScreenSize$;

  authService = inject(AuthService);

  toggleSideNav() {
    this.sidenav.emit();
  }

  logout() {
    this.authService.logout();
  }
}
