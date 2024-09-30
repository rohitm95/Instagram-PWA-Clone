import { Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { scheduled, asyncScheduler, tap, Subscription } from 'rxjs';
import { SpinnerService } from './shared/spinner.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressSpinnerModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PWA-gram';

  swUpdate = inject(SwUpdate);
  spinnerService = inject(SpinnerService);
  isLoadingResults = false;
  subscription: Subscription;

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

    this.subscription = this.spinnerService.showSpinner.subscribe(
      (response) => {
        this.isLoadingResults = response;
      }
    );
  }
}
