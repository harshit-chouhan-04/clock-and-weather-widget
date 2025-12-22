import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';

import { WeatherComponent } from '../weather/weather';

@Component({
  selector: 'app-clock',
  imports: [CommonModule, WeatherComponent],
  templateUrl: './clock.html',
  styleUrl: './clock.scss',
})
export class Clock implements OnInit, OnDestroy {
  /* ===== CLOCK MARKERS ===== */
  ticks = Array.from({ length: 60 }, (_, i) => i);

  /* ===== HAND ROTATION STRINGS ===== */
  secondLayerTransform = 'rotate(0deg)';
  minuteLayerTransform = 'rotate(0deg)';
  hourLayerTransform = 'rotate(0deg)';

  /* ===== DATE DISPLAY ===== */
  day = '';
  month = '';
  date = '';

  /* ===== TIMER ===== */
  private timerId!: number;

  ngOnInit(): void {
    this.updateClock();
    this.timerId = window.setInterval(() => {
      this.updateClock();
    }, 1000);
  }

  ngOnDestroy(): void {
    if (this.timerId) {
      clearInterval(this.timerId);
    }
  }

  /* ===== CORE CLOCK LOGIC ===== */
  updateClock(): void {
    const now = new Date();

    // Seconds, minutes, hours
    const seconds = now.getSeconds();
    const minutes = now.getMinutes();
    const hours = now.getHours() % 12;

    // Rotate GRID LAYERS (NOT HANDS)
    this.secondLayerTransform = `rotate(${seconds * 6}deg)`;
    this.minuteLayerTransform = `rotate(${minutes * 6}deg)`;
    this.hourLayerTransform = `rotate(${hours * 30 + minutes * 0.5}deg)`;

    // Date
    this.day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    this.month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.date = now.getDate().toString().padStart(2, '0');
  }
}
