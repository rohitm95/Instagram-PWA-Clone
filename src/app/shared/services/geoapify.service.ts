import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface GeoapifyResponse {
  features: {
    properties: {
      formatted: string;
      [key: string]: any;
    };
  }[];
}

@Injectable({
  providedIn: 'root',
})
export class GeoapifyService {
  private readonly apiKey = 'f8d2128415664c8289c9b165515e711b'; // Replace with your actual API key
  private readonly apiUrl = 'https://api.geoapify.com/v1/geocode/reverse';
  private readonly http = inject(HttpClient);

  getAddress(lat: number, lon: number): Observable<string> {
    const params = new HttpParams()
      .set('lat', lat.toString())
      .set('lon', lon.toString())
      .set('apiKey', this.apiKey);

    return this.http.get<GeoapifyResponse>(this.apiUrl, { params }).pipe(
      map((response) => {
        if (response.features && response.features.length > 0) {
          return `${response.features[0].properties['city']}, ${response.features[0].properties['state']}, ${response.features[0].properties['country']}`;
        } else {
          return 'No address given';
        }
      })
    );
  }
}

