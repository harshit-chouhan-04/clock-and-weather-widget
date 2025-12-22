import { Component, signal } from '@angular/core';

import { Clock } from './components/clock/clock';

@Component({
  selector: 'app-root',
  imports: [Clock],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App {
  public readonly title = signal('clock-and-weather-widget');
}
