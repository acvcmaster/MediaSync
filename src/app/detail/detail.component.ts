import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { FileIndexEntry } from '../api/types/file-index-entry';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  private file: FileIndexEntry;
  private environment: any;
  constructor(private route: ActivatedRoute, private apiService: ApiService) { 
    this.environment = environment;
    this.file = {name: '', size: 0};
  }

  ngOnInit() {
    const name: string = this.route.snapshot.params['name'];
    this.file.name = name;
    this.apiService.getFileSize(name).subscribe((value) => {
      this.file.size = value;
    })
  }
}
