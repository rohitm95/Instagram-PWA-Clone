import { TestBed } from '@angular/core/testing';
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
    service.observe().subscribe((state: BreakpointState) => {
      expect(state).toBeDefined();
      expect(state.matches).toBe(window.innerWidth < 768);
      done();
    });
    service.observe()
  });

  it('should update the screen size state on window resize', () => {
    const initialSize: BreakpointState = service['getCurrentScreenSize']();
    window.innerWidth = 500;
    window.dispatchEvent(new Event('resize'));
    const updatedSize: BreakpointState = service['getCurrentScreenSize']();
    expect(updatedSize.matches).toBeTrue();
    expect(updatedSize.breakpoints['sm']).toBeFalse();
    expect(updatedSize.breakpoints['xs']).toBeTrue();
  });

  it('should update the screen size state on window resize', () => {
    const initialSize: BreakpointState = service['getCurrentScreenSize']();
    window.innerWidth = 800;
    window.dispatchEvent(new Event('resize'));
    const updatedSize: BreakpointState = service['getCurrentScreenSize']();
    expect(updatedSize.matches).toBeFalse();
    expect(updatedSize.breakpoints['md']).toBeTrue();
  });
});
