import { TestBed } from '@angular/core/testing';
import { take } from 'rxjs';
import { ScreenObserverService } from './screen-observer-service';
import { BreakpointState } from '@angular/cdk/layout';

describe('ScreenObserverService', () => {
  let service: ScreenObserverService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [],
    });
    service = TestBed.inject(ScreenObserverService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set the initial screen size based on the current window width', () => {
    const initialScreenSize: BreakpointState =
      service['getCurrentScreenSize']();
    expect(initialScreenSize).toBeDefined();
    expect(initialScreenSize.matches).toBe(window.innerWidth < 768);
  });

  it('should emit the initial screen size state when observe is called', (done) => {
    service.observe().pipe(take(1)).subscribe((state: BreakpointState) => {
      expect(state).toBeDefined();
      expect(state.matches).toBe(window.innerWidth < 768);
      done();
    });
  });

  it('should update the screen size state on window resize', () => {
    window.innerWidth = 500;
    globalThis.dispatchEvent(new Event('resize'));
    const updatedSize: BreakpointState = service['getCurrentScreenSize']();
    expect(updatedSize.matches).toBeTrue();
    expect(updatedSize.breakpoints['sm']).toBeFalse();
    expect(updatedSize.breakpoints['xs']).toBeTrue();
  });

  it('should update the screen size state on window resize', () => {
    window.innerWidth = 800;
    globalThis.dispatchEvent(new Event('resize'));
    const updatedSize: BreakpointState = service['getCurrentScreenSize']();
    expect(updatedSize.matches).toBeFalse();
    expect(updatedSize.breakpoints['md']).toBeTrue();
  });
});
