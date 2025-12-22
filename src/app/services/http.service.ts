import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  public host = environment.openWeather.baseUrl;
  public endPointURL: string = '';

  private cancelRequests: { [key: string]: Subject<void> } = {};

  constructor(private http: HttpClient) {}

  private getCancelSubject(key: string): Subject<void> {
    if (!this.cancelRequests[key]) {
      this.cancelRequests[key] = new Subject<void>();
    }
    return this.cancelRequests[key];
  }

  cancelRequest(key: string = 'default'): void {
    if (this.cancelRequests[key]) {
      this.cancelRequests[key].next();
      this.cancelRequests[key].complete();
      delete this.cancelRequests[key];
    }
  }

  cancelAllRequests(): void {
    Object.keys(this.cancelRequests).forEach((key) => this.cancelRequest(key));
  }

  get(key: string = 'default'): Observable<any> {
    const cancelSubject = this.getCancelSubject(key);
    return this.http.get<any>(this.host + this.endPointURL).pipe(takeUntil(cancelSubject));
  }
}
