import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Clock } from './clock';

/* ==============================
   Mock Weather Component
================================ */
@Component({
  selector: 'app-weather',
  standalone: true,
  template: '',
})
class MockWeatherComponent {}

describe('Clock Component', () => {
  let component: Clock;
  let fixture: ComponentFixture<Clock>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Clock], // still import Clock
    })
      .overrideComponent(Clock, {
        set: {
          imports: [CommonModule, MockWeatherComponent], // ✅ override here
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(Clock);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    component.ngOnDestroy();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize ticks correctly', () => {
    expect(component.ticks.length).toBe(60);
  });

  it('should update clock correctly', () => {
    jasmine.clock().install();

    const mockDate = new Date(2025, 0, 1, 3, 15, 30); // Jan 1, 2025 03:15:30
    jasmine.clock().mockDate(mockDate);

    component.updateClock();

    expect(component.secondLayerTransform).toBe('rotate(180deg)');
    expect(component.minuteLayerTransform).toBe('rotate(90deg)');
    expect(component.hourLayerTransform).toBe('rotate(97.5deg)');

    expect(component.day).toBe('WED');
    expect(component.month).toBe('JAN');
    expect(component.date).toBe('01');

    jasmine.clock().uninstall();
  });

  it('should clear interval on destroy', () => {
    spyOn(window, 'clearInterval');

    component.ngOnInit();
    component.ngOnDestroy();

    expect(window.clearInterval).toHaveBeenCalled();
  });
});
