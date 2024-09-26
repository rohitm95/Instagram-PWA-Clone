import { Component, EventEmitter, inject, OnInit, Output } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';
import { RouterModule } from '@angular/router';
import { ScreenObserverService } from '../screen-observer-service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [MatToolbarModule, MatIconModule, MatButtonModule, RouterModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent implements OnInit {
  @Output() sidenav: EventEmitter<any> = new EventEmitter();
  isMobile = false;

  screenObserver = inject(ScreenObserverService);

  ngOnInit(): void {
    this.screenObserver.observe().subscribe((screenSize) => {
      if(screenSize.matches) {
        this.isMobile = true;
      } else {
        this.isMobile = false;
      }
    })
  }

  toggleSideNav() {
    this.sidenav.emit();
  }
}
