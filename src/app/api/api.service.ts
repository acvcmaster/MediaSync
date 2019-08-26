import { Injectable } from '@angular/core';
import { FileIndexEntry } from './types/file-index-entry';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http'
import { ApiResponse } from './types/api-response';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public apiUrl: string = 'http://10.0.0.50:8080/api/File';
  constructor(private httpClient: HttpClient) { }

  getFileIndex() : Observable<FileIndexEntry[]>
  {
    return this.httpClient.get<ApiResponse>(`${this.apiUrl}/GetFileIndex`).pipe(map((data) => data.result));
  }
}
