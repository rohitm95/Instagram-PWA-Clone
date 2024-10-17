import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { of } from 'rxjs';
import { SwUpdate } from '@angular/service-worker';
import { ChangeDetectorRef } from '@angular/core';
import { SpinnerService } from './shared/services/spinner.service';

class MockSwUpdate {
  isEnabled = true;
  checkForUpdate() {
    return of(null); // Mock the method as needed
  }
}

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let spinnerService: jasmine.SpyObj<SpinnerService>;
  let cdr: jasmine.SpyObj<ChangeDetectorRef>;

  beforeEach(async () => {
    const spinnerServiceSpy = jasmine.createSpyObj('SpinnerService', ['showSpinner$']);
    const cdrSpy = jasmine.createSpyObj('ChangeDetectorRef', ['detectChanges']);

    await TestBed.configureTestingModule({
      imports: [AppComponent],
      providers: [
        { provide: SwUpdate, useClass: MockSwUpdate },
        { provide: SpinnerService, useValue: spinnerServiceSpy },
        { provide: ChangeDetectorRef, useValue: cdrSpy },
      ]
    }).compileComponents();
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    spinnerService = TestBed.inject(SpinnerService) as jasmine.SpyObj<SpinnerService>;
    cdr = TestBed.inject(ChangeDetectorRef) as jasmine.SpyObj<ChangeDetectorRef>;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it(`should have the 'PWA-gram' title`, () => {
    expect(component.title).toEqual('PWA-gram');
  });

  it('should assign isLoadingResults to showSpinner$ on init', () => {
    component.ngOnInit();

    expect(component.isLoadingResults).toEqual(spinnerService.showSpinner$);
  });
});
