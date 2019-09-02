import { Component, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ApiService } from '../api/api.service';
import { DownloadService } from '../api/download.service';
import { ToastController } from '@ionic/angular';

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
  @ViewChild('cardVideo', { static: false }) cardVideo: ElementRef;
  @ViewChild('overlay', { static: false }) overlay: ElementRef;

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

  play() {

    if (!this.supportedExtension(this.details.extension)) {
      return;
    }

    const cardVideo = this.cardVideo.nativeElement;
    const overlay = this.overlay.nativeElement;

    if (!cardVideo || !overlay) {
      return;
    }

    if (cardVideo.paused) {
      cardVideo.play();
      overlay.style.opacity = 0;
    } else {
      cardVideo.pause();
      overlay.style.opacity = 1;
    }
  }

  downloadClicked() {
    this.downloadService.download(this.file.name, () => this.changeDetectorRef.detectChanges());
    this.changeDetectorRef.detectChanges();
  }

  colorFromExtension(extension: string) {
    if (extension) {
      return this.supportedExtension(extension) ?
        'success' : 'danger';
    }
  }

  badgeToast(extension: string) {
    if (extension) {
      const message: string = this.supportedExtension(extension) ?
        'This extension supports previewing on the app.' : 'Unsupported extension. Previewing will be disabled.';
      this.toastController.create({
        message: message,
        duration: 2000
      }).then((toast) => toast.present());
    }
  }
  
  supportedExtension(extension: string): boolean {
    if (extension) {
      const supportedFormats: string[] = [".mp4", ".webm"];
      return supportedFormats.indexOf(extension) !== -1;
    }
  }
}
