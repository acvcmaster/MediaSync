import { Component, OnInit, ChangeDetectorRef, ViewChild } from '@angular/core';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';
import { DownloadService } from '../api/download.service';
import { IonSearchbar } from '@ionic/angular';
import { catchError } from 'rxjs/operators';
import { of } from 'rxjs';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(
    private apiService: ApiService,
    public downloadService: DownloadService,
    private changeDetectorRef: ChangeDetectorRef) { }

  public fileList: any[] = [];
  public fileListFiltered: any[] = [];
  public environment: any;
  @ViewChild('searchBar', { static: false }) searchBar: IonSearchbar;

  ngOnInit(): void {
    this.apiService.getFileNames().subscribe((values) => {
      this.fileList = values.map((name) => {
        return {
          name: name,
          downloading: () => this.downloadService.isDownloading(name),
          downloaded: () => this.downloadService.isDownloaded(name)
        }
      });
      this.fileListFiltered = this.fileList;
    });
    this.environment = environment;
  }

  onRefresh(event: any) {
    this.apiService.getFileNames().pipe(catchError(_ => { // On error
      event.target.complete(); // stop refresher
      return of([] as string[]); // fallback value
    })).subscribe((values) => {
      this.fileList = values.map((name) => { // On success
        return {
          name: name,
          downloading: () => this.downloadService.isDownloading(name),
          downloaded: () => this.downloadService.isDownloaded(name)
        }
      });
      const filterEvent = event;
      filterEvent.target.value = this.searchBar.value;
      this.onFilter(filterEvent);
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

  onFilter(event: any) {
    const filter: string = event.target.value;
    this.fileListFiltered = this.fileList.filter((value) => {
      return value.name.toLowerCase().indexOf(filter.toLowerCase()) !== -1;
    });
  }
}
