import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { DownloadService } from '../api/download.service';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(private apiService: ApiService, public downloadService: DownloadService, private changeDetectorRef: ChangeDetectorRef) { }
  public fileList: any[] = [];
  public environment: any;

  ngOnInit(): void {
    this.apiService.getFileNames().subscribe((values) =>
      this.fileList = values.map((name) => {
        return {
          name: name,
          downloading: () => this.downloadService.isDownloading(name),
          downloaded: () => this.downloadService.isDownloaded(name)
        }
      }));
    this.environment = environment;

  }

  onRefresh(event: any) {
    this.apiService.getFileNames().subscribe((values) => {
      this.fileList = values.map((name) => {
        return {
          name: name,
          downloading: () => this.downloadService.isDownloading(name),
          downloaded: () => this.downloadService.isDownloaded(name)
        }
      });
      event.target.complete();
    });
  }

  downloadClicked(file: string, slidingItem: any) {
    slidingItem.close();
    this.downloadService.download(file, () => this.changeDetectorRef.detectChanges());
    this.changeDetectorRef.detectChanges();
  }

  removeClicked(file: string, slidingItem: any) {
    slidingItem.close();
    this.downloadService.removeFile(file, () => this.changeDetectorRef.detectChanges());
    this.changeDetectorRef.detectChanges();
  }

  downloadAll() {
    if(this.fileList) {
      this.fileList.forEach((value) => {
        this.downloadService.download(value.name, () => this.changeDetectorRef.detectChanges());
      });
      this.changeDetectorRef.detectChanges();
    }
  }
}
