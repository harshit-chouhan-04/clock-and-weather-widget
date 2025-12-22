import { Component } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { App } from './app';

/* ==============================
   Mock Clock Component
================================ */
@Component({
  selector: 'app-clock',
  standalone: true,
  template: '',
})
class MockClockComponent {}

describe('App Component', () => {
  let component: App;
  let fixture: ComponentFixture<App>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    })
      .overrideComponent(App, {
        set: {
          imports: [MockClockComponent], // ✅ override real Clock
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(App);
    component = fixture.componentInstance;
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should have correct title signal value', () => {
    expect(component.title()).toBe('clock-and-weather-widget');
  });
});
