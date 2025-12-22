import { TestBed } from '@angular/core/testing';
import { WeatherService } from './weather';
import { HttpService } from './http.service';
import { of } from 'rxjs';

class MockHttpService {
  endPointURL = '';

  get = jasmine.createSpy('get').and.returnValue(
    of({
      main: { temp: 15 },
      weather: [{ icon: '01d' }],
    })
  );
}

describe('WeatherService', () => {
  let service: WeatherService;
  let httpService: MockHttpService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [WeatherService, { provide: HttpService, useClass: MockHttpService }],
    });

    service = TestBed.inject(WeatherService);
    httpService = TestBed.inject(HttpService) as unknown as MockHttpService;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should set endpoint and call http.get()', () => {
    const lat = 51.5074;
    const lon = -0.1278;

    service.getCurrentWeather(lat, lon).subscribe();

    expect(httpService.endPointURL).toContain(`lat=${lat}`);
    expect(httpService.endPointURL).toContain(`lon=${lon}`);
    expect(httpService.get).toHaveBeenCalled();
  });
});
