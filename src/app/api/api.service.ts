import { Injectable } from '@angular/core';
import { FileIndexEntry } from './types/file-index-entry';
import { Observable, from } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { ApiResponse } from './types/api-response';
import { environment } from 'src/environments/environment';


@Injectable({
  providedIn: 'root'
})
export class ApiService {
  constructor(private httpClient: HttpClient) { }

  getFileIndex() : Observable<FileIndexEntry[]>
  {
    return this.httpClient.get<ApiResponse>(`${environment.apiUrl}/GetFileIndex`).pipe(map((data) => data.result));
  }
}
