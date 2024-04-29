import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private BASE_URL = environment.api_url;

  private httpHeaders = new HttpHeaders({
    'Content-Type': 'application/json',
  });

  constructor(private http: HttpClient) {}

  public post(url: string, data: any): Observable<any> {
    return this.http
      .post(this.BASE_URL + url, data, {
        observe: 'response',
        headers: this.httpHeaders,
      })
      .pipe(map((res) => res.body));
  }
}
