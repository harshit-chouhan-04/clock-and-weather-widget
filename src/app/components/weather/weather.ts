import { Component, OnInit } from '@angular/core';
import { WeatherService } from '../../services/weather';

@Component({
  selector: 'app-weather',
  imports: [],
  templateUrl: './weather.html',
  styleUrl: './weather.scss',
})
export class WeatherComponent implements OnInit {
  temperature!: number;
  weatherIcon = '';

  constructor(private weatherService: WeatherService) {}

  ngOnInit(): void {
    this.loadWeather();
  }

  loadWeather(): void {
    const lat = 51.5074;
    const lon = -0.1278;

    this.weatherService.getCurrentWeather(lat, lon).subscribe({
      next: (data) => {
        this.temperature = Math.round(data.main.temp);
        this.weatherIcon = `https://openweathermap.org/img/wn/${data.weather[0].icon}.png`;
      },
      error: (err) => {
        console.error('Weather API error', err);
      },
    });
  }
}
