import { Component, OnInit } from '@angular/core';
import { FileIndexEntry } from '../api/types/file-index-entry';
import { ApiService } from '../api/api.service';
import { ChangeDetectorRef } from '@angular/core';

@Component({
  selector: 'app-tab3',
  templateUrl: 'tab3.page.html',
  styleUrls: ['tab3.page.scss']
})
export class Tab3Page implements OnInit {

  constructor(private apiService: ApiService, private cdr: ChangeDetectorRef) { }
  private fileList: FileIndexEntry[] = [];

  ngOnInit(): void {
    this.apiService.getFileIndex().subscribe((values) => this.fileList = values);
  }

  onRefresh(event: any) { // TODO: implement logic
    setTimeout(() => {
      event.target.complete();
    }, 1000);
  }
}
