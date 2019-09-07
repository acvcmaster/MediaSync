import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { DownloadService } from '../api/download.service';
import { ToastController, IonCheckbox } from '@ionic/angular';
import { ToastButton } from '@ionic/core';

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
  @ViewChild('transcoding', { static: false }) transcoding: IonCheckbox;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private downloadService: DownloadService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastController: ToastController) {
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

  downloadClicked() {
    this.downloadService.download(this.file.name, () => this.changeDetectorRef.detectChanges());
    this.changeDetectorRef.detectChanges();
  }

  colorFromExtension(extension: string) {
    if (extension) {
      if (this.transcodingChecked()) {
        return this.supportedExtension(extension) ?
          'success' : 'warning';
      } else {
        return this.supportedExtension(extension) ?
          'success' : 'danger';
      }
    }
  }

  badgeToast(extension: string) {
    let buttons: ToastButton[] = [];
    let duration = 2000;
    if (extension) {
      let message: string = '';
      if (this.transcodingChecked()) {
        message = this.supportedExtension(extension) ?
          'This extension supports previewing on the app.' : 'Unsupported extension. The server will transcode this file into a playable format.';
      } else {
        message = this.supportedExtension(extension) ?
          'This extension supports previewing on the app.' : 'Unsupported extension. Previewing will be disabled. Click \'Enable\' to enable transcoding.';
        if (!this.supportedExtension(extension)) {
          duration = 4000;
          buttons.push({
            text: 'Enable',
            side: 'end',
            handler: () => this.transcoding.checked = true
          });
        }
      }
      this.toastController.create({
        message: message,
        duration: duration,
        buttons: buttons
      }).then((toast) => toast.present());
    }
  }

  transcodeToast() {
    const message = 'Transcoding allows for smoother playback at the cost ' +
      'of heavy CPU and memory usage in the server. This in turn limits the ' +
      'number of concurrent transcoded streams that are possible. Enable ' +
      'this only if you\'re having playback issues, or if playback is not possible.';
    this.toastController.create({
      message: message,
      duration: 10000
    }).then((toast) => toast.present());
  }
  
  supportedExtension(extension: string): boolean {
    if (extension) {
      const supportedFormats: string[] = ['.mp4', '.webm'];
      return supportedFormats.indexOf(extension) !== -1;
    }
  }

  transcodingChecked() {
    if (this.transcoding) {
      return this.transcoding.checked;
    }
    return false;
  }
}
