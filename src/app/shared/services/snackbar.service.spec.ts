import { TestBed } from '@angular/core/testing';
import { SnackbarService } from './snackbar.service';
import { MatSnackBar } from '@angular/material/snack-bar';

describe('SnacbarService', () => {
  let service: SnackbarService;
  let snackbarSpy: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    snackbarSpy = jasmine.createSpyObj('MatSnackBar', ['open']);
    TestBed.configureTestingModule({
      providers: [{ provide: MatSnackBar, useValue: snackbarSpy }],
    });
    service = TestBed.inject(SnackbarService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should show snackbar with correct message, action and duration', () => {
    service.showSnackbar('Operation successful', 'Close', 3000);
    expect(snackbarSpy.open).toHaveBeenCalledWith(
      'Operation successful',
      'Close',
      { duration: 3000 }
    );
  });

  it('should show snackbar with message and action', () => {
    service.showSnackbar('Data saved', 'Undo', 5000);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Data saved', 'Undo', {
      duration: 5000,
    });
  });

  it('should show snackbar with message and action', (done) => {
    service.showSnackbar('Item deleted', 'Retry', 2000);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Item deleted', 'Retry', {
      duration: 2000,
    });
    done();
  });

  it('should open a snackbar with the message for 4000 milliseconds', () => {
    service.showSnackbar('Changes applied', '', 4000);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Changes applied', '', {
      duration: 4000,
    });
  });

  it('should show snackbar with message, action and duration', () => {
    service.showSnackbar('Welcome back!', 'Dismiss', 3500);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Welcome back!', 'Dismiss', {
      duration: 3500,
    });
  });

  it('should show snackbar with message, action and duration', () => {
    service.showSnackbar('Profile updated', 'View', 6000);
    expect(snackbarSpy.open).toHaveBeenCalledWith('Profile updated', 'View', {
      duration: 6000,
    });
  });
});
