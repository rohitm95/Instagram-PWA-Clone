import { ChangeDetectorRef, Component, inject } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { RouterOutlet } from '@angular/router';
import { SwUpdate } from '@angular/service-worker';
import { scheduled, asyncScheduler, tap, Subscription } from 'rxjs';
import { SpinnerService } from './shared/services/spinner.service';
import { AsyncPipe } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MatProgressSpinnerModule, AsyncPipe],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'PWA-gram';

  swUpdate = inject(SwUpdate);
  spinnerService = inject(SpinnerService);
  isLoadingResults;
  cdr = inject(ChangeDetectorRef);

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

    this.isLoadingResults = this.spinnerService.showSpinner$;
  }
}
