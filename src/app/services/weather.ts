import { Injectable } from '@angular/core';

import { environment } from '../../environments/environment';
import { HttpService } from './http.service';

@Injectable({
  providedIn: 'root',
})
export class WeatherService {
  constructor(private http: HttpService) {}

  getCurrentWeather(lat: number, lon: number) {
    const { apiKey } = environment.openWeather;

    this.http.endPointURL = `?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`;
    return this.http.get();
  }
}
