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
  private rafId: number | null = null;

  private loop = () => {
    this.updateClock();
    this.rafId = requestAnimationFrame(this.loop);
  };

  ngOnInit(): void {
    this.updateClock();
    this.rafId = requestAnimationFrame(this.loop);
  }

  ngOnDestroy(): void {
    if (this.rafId) {
      cancelAnimationFrame(this.rafId);
      this.rafId = null;
    }
  }

  /* ===== CORE CLOCK LOGIC ===== */
  updateClock(): void {
    const now = new Date();

    // Fractional seconds, minutes, hours for smooth movement
    const seconds = now.getSeconds() + now.getMilliseconds() / 1000;
    const minutes = now.getMinutes() + seconds / 60;
    const hours = (now.getHours() % 12) + minutes / 60;

    // Rotate GRID LAYERS (NOT HANDS) — now using smooth fractional values
    this.secondLayerTransform = `rotate(${seconds * 6}deg)`;
    this.minuteLayerTransform = `rotate(${minutes * 6}deg)`;
    this.hourLayerTransform = `rotate(${hours * 30}deg)`;

    // Date
    this.day = now.toLocaleDateString('en-US', { weekday: 'short' }).toUpperCase();
    this.month = now.toLocaleDateString('en-US', { month: 'short' }).toUpperCase();
    this.date = now.getDate().toString().padStart(2, '0');
  }
}
