import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { DownloadService } from '../api/download.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
})
export class DetailComponent implements OnInit {
  public file: any;
  public details: any;
  public metadata: string[];
  public environment: any;
  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private downloadService: DownloadService,
    private changeDetectorRef: ChangeDetectorRef) {
    this.environment = environment;
  }

  ngOnInit() {
    const name: string = this.route.snapshot.params['name'];
    this.file = {
      name: name,
      downloading: () => this.downloadService.isDownloading(name),
      downloaded: () => this.downloadService.isDownloaded(name)
    };
    this.apiService.getDetails(name).subscribe((value) => this.details = value);
    this.apiService.getMetadata(name).subscribe((value) => this.metadata = value);
  }

  play(cardVideo: any) {
    if (!cardVideo) {
      return;
    }

    if (cardVideo.paused) {
      cardVideo.play();
    } else {
      cardVideo.pause();
    }
  }

  downloadClicked() {
    this.downloadService.download(this.file.name, () => this.changeDetectorRef.detectChanges());
    this.changeDetectorRef.detectChanges();
  }

}
