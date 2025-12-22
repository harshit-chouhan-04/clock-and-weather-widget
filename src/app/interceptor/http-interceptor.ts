import {
  HttpErrorResponse,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

import { environment } from '../../environments/environment';

export const httpInterceptor: HttpInterceptorFn = (req: HttpRequest<any>, next: HttpHandlerFn) => {
  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      handleError(error);
      return throwError(() =>
        environment.production
          ? 'Something bad happened; please try again later.'
          : error.error?.message
      );
    })
  );
};

/* ==============================
   Error Handler
================================ */
function handleError(error: HttpErrorResponse): void {
  if (error.status >= 500) {
    alert('An unexpected error occurred. Please try again later.');
  } else if (error.status >= 429) {
    alert('Too many attempts. Please try again in 5 minutes.');
  } else if (error.status === 401) {
    alert('Invalid API key');
  } else if (error.status >= 400) {
    alert(error.error?.message ?? 'Request Error');
  }

  if (error.error instanceof ErrorEvent) {
    console.error('Client error:', error.error.message);
  } else {
    console.error(`Backend returned code ${error.status}`, error.error);
  }
}
