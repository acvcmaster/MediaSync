import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { ApiResponse } from './types/api-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  getFileNames(): Observable<string[]> {
    return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/GetFileNames`).pipe(map((data) => data.result));
  }

  getDetails(name: string): Observable<any> {
    return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/GetDetails?file=${name}`).pipe(map((data) => data.result));
  }

  getMetadata(name: string): Observable<string[]> {
    return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/GetMetadata?file=${name}`).pipe(map((data) => data.result));
  }
}
