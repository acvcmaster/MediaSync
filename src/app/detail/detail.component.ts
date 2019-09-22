import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { DownloadService } from '../api/download.service';
import { ToastController, IonCheckbox } from '@ionic/angular';
import { ToastButton } from '@ionic/core';
import { SettingsService } from '../api/settings.service';

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
  public localPath: string;
  @ViewChild('transcoding', { static: false }) transcoding: IonCheckbox;

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService,
    private downloadService: DownloadService,
    private changeDetectorRef: ChangeDetectorRef,
    private toastController: ToastController,
    private settingsService: SettingsService) {
    this.environment = environment;
  }

  ngOnInit() {
    // tslint:disable:no-string-literal
    const name: string = this.route.snapshot.params['name'];
    this.file = {
      name,
      downloading: () => this.downloadService.isDownloading(name),
      downloaded: () => this.downloadService.isDownloaded(name)
    };
    this.apiService.getDetails(name).subscribe((value) => this.details = value);
    this.apiService.getMetadata(name).subscribe((value) => this.metadata = value);
    this.downloadService.getLocalPath(name).then((path) => this.localPath = path);
  }

  downloadClicked() {
    this.downloadService.addToQueue(this.file.name, () => this.changeDetectorRef.detectChanges());
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
    let duration = 2000;
    if (extension) {
      let message = '';
      if (this.transcodingChecked()) {
        message = this.supportedExtension(extension) ?
          'This extension supports previewing on the app.'
            : 'Unsupported extension. The server will transcode this file into a playable format.';
      } else {
        if (this.supportedExtension(extension)) {
          message = 'This extension supports previewing on the app.';
        } else {
          message = 'Unsupported extension. Previewing will be disabled (enable transcoding in settings if you wish to preview).';
          duration = 3000;
        }
      }
      this.toastController.create({
        message,
        duration
      }).then((toast) => toast.present());
    }
  }

  supportedExtension(extension: string): boolean {
    if (extension) {
      const supportedFormats: string[] = ['.mp4', '.webm'];
      return supportedFormats.indexOf(extension) !== -1;
    }
  }

  transcodingChecked(): boolean {
    return this.settingsService.get('transcode') as boolean;
  }

  quality(): string {
    return this.settingsService.get('quality') as string;
  }

  changeContainersOnlyChecked(): boolean {
    return this.settingsService.get('changeContainersOnly') as boolean;
  }

  hardwareAcceleration(): boolean {
    return this.settingsService.get('hardwareAcceleration') as boolean;
  }
}
