import { Component } from '@angular/core';
import { DownloadService } from '../api/download.service';
import { ApiService } from '../api/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {

  constructor(
    private apiService: ApiService,
    private downloadService: DownloadService,
    private router: Router) { }

  syncAll() {
    this.apiService.getFileNames().subscribe((values) =>
      values.forEach((value) => {
        this.downloadService.addToQueue(value);
        this.router.navigate(['/tabs/tab3']);
      }));
  }
}
