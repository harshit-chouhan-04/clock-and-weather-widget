import { Component, OnDestroy, OnInit } from '@angular/core';

import { LocalStorageService } from '../../services/local-storage.service';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
})
export class WeatherComponent implements OnInit, OnDestroy {
  temperature!: number;
  weatherIcon = '';

  constructor(
    private weatherService: WeatherService,
    private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    const weatherData = this.localStorageService.get('weatherData');

    if (weatherData) {
      const currentTime = Date.now();
      const dataAge = currentTime - weatherData.timestamp;

      // If data is less than 30 minutes old, use cached data
      if (dataAge < 30 * 60 * 1000) {
        this.temperature = weatherData.temperature;
        this.weatherIcon = weatherData.weatherIcon;
        return;
      }
    }

    let lat = 51.5074;
    let lon = -0.1278;

    navigator.geolocation.getCurrentPosition(
      (position) => {
        lat = position.coords.latitude;
        lon = position.coords.longitude;
      },
      (error) => {
        console.log(error);
      }
    );

    this.weatherService.getCurrentWeather(lat, lon).subscribe({
      next: (data) => {
        this.temperature = Math.round(data.main.temp);
        this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;

        this.localStorageService.set('weatherData', {
          temperature: this.temperature,
          weatherIcon: this.weatherIcon,
          lat,
          lon,
          timestamp: Date.now(),
        });
      },
      error: (err) => {
        console.error('Weather API error', err);
      },
    });
  }

  ngOnDestroy(): void {
    this.weatherService.http.cancelAllRequests();
  }
}
