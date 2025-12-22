import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideHttpClientTesting, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';

import { environment } from '../../environments/environment';
import { httpInterceptor } from './http-interceptor';

describe('httpInterceptor', () => {
  let http: HttpClient;
  let backend: HttpTestingController;

  beforeEach(() => {
    spyOn(window, 'alert'); // mock alert

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([httpInterceptor])),
        provideHttpClientTesting(),
      ],
    });

    http = TestBed.inject(HttpClient);
    backend = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    backend.verify();
  });

  it('should pass through successful requests', () => {
    http.get('/test').subscribe((res) => {
      expect(res).toEqual({ success: true });
    });

    const req = backend.expectOne('/test');
    req.flush({ success: true });
  });

  it('should handle 500 server error', () => {
    http.get('/error-500').subscribe({
      error: (err) => {
        expect(window.alert).toHaveBeenCalledWith(
          'An unexpected error occurred. Please try again later.'
        );
      },
    });

    const req = backend.expectOne('/error-500');
    req.flush({ message: 'Server error' }, { status: 500, statusText: 'Server Error' });
  });

  it('should handle 429 error', () => {
    http.get('/error-429').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith(
          'Too many attempts. Please try again in 5 minutes.'
        );
      },
    });

    const req = backend.expectOne('/error-429');
    req.flush({ message: 'Too many requests' }, { status: 429, statusText: 'Too Many Requests' });
  });

  it('should handle 401 error', () => {
    http.get('/error-401').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Invalid API key');
      },
    });

    const req = backend.expectOne('/error-401');
    req.flush({ message: 'Unauthorized' }, { status: 401, statusText: 'Unauthorized' });
  });

  it('should handle generic 400 error', () => {
    http.get('/error-400').subscribe({
      error: () => {
        expect(window.alert).toHaveBeenCalledWith('Bad Request');
      },
    });

    const req = backend.expectOne('/error-400');
    req.flush({ message: 'Bad Request' }, { status: 400, statusText: 'Bad Request' });
  });

  it('should throw masked error message in production', (done) => {
    environment.production = true;

    http.get('/prod-error').subscribe({
      error: (err) => {
        expect(err).toBe('Something bad happened; please try again later.');
        done();
      },
    });

    const req = backend.expectOne('/prod-error');
    req.flush({ message: 'Internal error' }, { status: 500, statusText: 'Server Error' });
  });

  it('should throw detailed error message in development', (done) => {
    environment.production = false;

    http.get('/dev-error').subscribe({
      error: (err) => {
        expect(err).toBe('Internal error');
        done();
      },
    });

    const req = backend.expectOne('/dev-error');
    req.flush({ message: 'Internal error' }, { status: 500, statusText: 'Server Error' });
  });
});
