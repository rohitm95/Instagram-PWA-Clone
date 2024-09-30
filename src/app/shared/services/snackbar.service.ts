import { Injectable, inject } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root',
})
export class SnackbarService {
  snackbar = inject(MatSnackBar);
  constructor() {}

  showSnackbar(message, action, duration) {
    this.snackbar.open(message, action, { duration: duration });
  }
}