import { TestBed } from '@angular/core/testing';
import { HttpTestingController } from '@angular/common/http/testing';
import { GeoapifyService } from './geoapify.service';

describe('GeoapifyService', () => {
  let service: GeoapifyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [],
      providers: [GeoapifyService]
    });
    service = TestBed.inject(GeoapifyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should return formatted address when API returns data', () => {
    const mockLat = 40.7128;
    const mockLon = -74.006;
    const mockResponse = {
      features: [
        {
          properties: {
            city: 'New York',
            state: 'New York',
            country: 'United States',
            formatted: 'New York, NY, USA'
          }
        }
      ]
    };

    service.getAddress(mockLat, mockLon).subscribe((address) => {
      expect(address).toBe('New York, New York, United States');
    });

    const req = httpMock.expectOne((request) => 
      request.url === 'https://api.geoapify.com/v1/geocode/reverse' &&
      request.params.get('lat') === '40.7128' &&
      request.params.get('lon') === '-74.006' &&
      request.params.get('apiKey') === (service as any).apiKey
    );

    expect(req.request.method).toBe('GET');
    req.flush(mockResponse);
  });

  it('should return "No address given" when API returns no features', () => {
    const mockLat = 0;
    const mockLon = 0;
    const mockResponse = {
      features: []
    };

    service.getAddress(mockLat, mockLon).subscribe((address) => {
      expect(address).toBe('No address given');
    });

    const req = httpMock.expectOne((request) => 
      request.url === 'https://api.geoapify.com/v1/geocode/reverse'
    );
    
    req.flush(mockResponse);
  });

  it('should handle API error gracefully (though currently service does not have error handling)', () => {
    // This test documentation is useful if you add error handling later.
    // Currently, the map operator will fail if features is missing entirely.
    const mockLat = 0;
    const mockLon = 0;

    service.getAddress(mockLat, mockLon).subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
      }
    });

    const req = httpMock.expectOne((request) => 
      request.url === 'https://api.geoapify.com/v1/geocode/reverse'
    );
    
    req.error(new ProgressEvent('error'));
  });
});
