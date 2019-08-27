import { Component, OnInit } from '@angular/core';
import { FileIndexEntry } from '../api/types/file-index-entry';
import { ApiService } from '../api/api.service';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(private apiService: ApiService) { }
  private fileList: FileIndexEntry[] = [];
  private environment: any;

  ngOnInit(): void {
    this.apiService.getFileIndex().subscribe((values) => this.fileList = values);
    this.environment = environment;
  }

  onRefresh(event: any) {
    this.apiService.getFileIndex().subscribe((values) => {
      this.fileList = values;
      event.target.complete();
    })
  }
}
