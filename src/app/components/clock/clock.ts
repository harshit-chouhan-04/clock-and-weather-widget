import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

@Component({
  selector: 'app-clock',
  imports: [CommonModule],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
})
export class Clock implements OnInit, OnDestroy {
  markers = Array.from({ length: 60 }, (_, i) => i);

  hourTransform = '';
  minuteTransform = '';
  secondTransform = '';

  day = '';
  month = '';
  date = '';

  temperature = 9;
  weatherIcon = 'https://openweathermap.org/img/wn/03d@2x.png';

  private timer!: number;

  private lastSecond = 0;
  private secondBaseRotation = 0;

  ngOnInit(): void {
    this.updateClock();
    this.timer = window.setInterval(() => this.updateClock(), 1000);
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  updateClock(): void {
    const now = new Date();

    // Use continuous time (do NOT round)
    const rawSeconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const rawMinutes = now.getMinutes() + rawSeconds / 60;
    const rawHours = (now.getHours() % 12) + rawMinutes / 60;

    const currentSecond = Math.floor(rawSeconds);

    // Detect full sweep completion (59 → 0)
    if (currentSecond < this.lastSecond) {
      this.secondBaseRotation += 360;
    }

    this.lastSecond = currentSecond;

    // Apply cumulative rotation
    const secondAngle = this.secondBaseRotation + rawSeconds * 6;

    this.secondTransform = `translateX(-50%) rotate(${secondAngle}deg)`;
    this.minuteTransform = `translateX(-50%) rotate(${rawMinutes * 6}deg)`;
    this.hourTransform = `translateX(-50%) rotate(${rawHours * 30}deg)`;

    // Date display
    this.day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    this.month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.date = now.getDate().toString().padStart(2, '0');
  }
}
