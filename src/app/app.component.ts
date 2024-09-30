import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { scheduled, asyncScheduler, tap } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PWA-gram';

  swUpdate = inject(SwUpdate);

  ngOnInit(): void {
    if (this.swUpdate.isEnabled) {
      scheduled(this.swUpdate.checkForUpdate(), asyncScheduler).pipe(
        tap(() => {
          // if (confirm("New version available. Load new version?")) {
          window.location.reload();
          // }
        })
      );
    }
  }
}
