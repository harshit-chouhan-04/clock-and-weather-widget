import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { WeatherComponent } from './weather';
import { WeatherService } from '../../services/weather';
import { LocalStorageService } from '../../services/local-storage.service';

/* ==============================
   Mock Services
================================ */

class MockHttpService {
  cancelAllRequests = jasmine.createSpy('cancelAllRequests');
}

class MockWeatherService {
  http = new MockHttpService();

  getCurrentWeather = jasmine.createSpy('getCurrentWeather').and.returnValue(
    of({
      main: { temp: 14.7 },
      weather: [{ icon: '03d' }],
    })
  );
}

class MockLocalStorageService {
  private store: Record<string, any> = {};

  get(key: string) {
    return this.store[key];
  }

  set(key: string, value: any) {
    this.store[key] = value;
  }

  clear() {
    this.store = {};
  }
}

describe('WeatherComponent', () => {
  let component: WeatherComponent;
  let fixture: ComponentFixture<WeatherComponent>;
  let weatherService: MockWeatherService;
  let localStorageService: MockLocalStorageService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WeatherComponent], // standalone component
      providers: [
        { provide: WeatherService, useClass: MockWeatherService },
        {
          provide: LocalStorageService,
          useClass: MockLocalStorageService,
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(WeatherComponent);
    component = fixture.componentInstance;

    weatherService = TestBed.inject(WeatherService) as unknown as MockWeatherService;

    localStorageService = TestBed.inject(LocalStorageService) as unknown as MockLocalStorageService;
  });

  afterEach(() => {
    localStorageService.clear();
  });

  /* ==============================
     BASIC
  ================================ */

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /* ==============================
     CACHE HIT
  ================================ */

  it('should use cached weather data if less than 30 minutes old', () => {
    localStorageService.set('weatherData', {
      temperature: 20,
      weatherIcon: 'cached-icon.png',
      timestamp: Date.now(),
    });

    component.loadWeather();

    expect(component.temperature).toBe(20);
    expect(component.weatherIcon).toBe('cached-icon.png');
    expect(weatherService.getCurrentWeather).not.toHaveBeenCalled();
  });

  /* ==============================
     CACHE EXPIRED → API CALL
  ================================ */

  it('should fetch weather data if cached data is expired', () => {
    localStorageService.set('weatherData', {
      temperature: 10,
      weatherIcon: 'old.png',
      timestamp: Date.now() - 31 * 60 * 1000,
    });

    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success: any) => {
      success({
        coords: {
          latitude: 51.5074,
          longitude: -0.1278,
        },
      });
    });

    component.loadWeather();

    expect(weatherService.getCurrentWeather).toHaveBeenCalled();
    expect(component.temperature).toBe(15);
    expect(component.weatherIcon).toContain('03d');
  });

  /* ==============================
     NO CACHE → API CALL
  ================================ */

  it('should fetch weather data when no cache exists', () => {
    spyOn(navigator.geolocation, 'getCurrentPosition').and.callFake((success: any) => {
      success({
        coords: {
          latitude: 40.7128,
          longitude: -74.006,
        },
      });
    });

    component.loadWeather();

    expect(weatherService.getCurrentWeather).toHaveBeenCalled();
    expect(component.temperature).toBe(15);
  });

  /* ==============================
     CLEANUP
  ================================ */

  it('should cancel all HTTP requests on destroy', () => {
    component.ngOnDestroy();
    expect(weatherService.http.cancelAllRequests).toHaveBeenCalled();
  });
});
