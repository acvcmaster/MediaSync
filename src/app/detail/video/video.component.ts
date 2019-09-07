import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit, OnDestroy {

  @Input() file: string;
  @Input() transcode: boolean = false;
  @Input() preload: boolean = false;
  @Input() type = 'video/mp4';
  @Input() quality = 'High';
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;
  @ViewChild('overlay', { static: false }) overlay: ElementRef;
  
  constructor() { }

  ngAfterViewInit() {
    if (this.preload && !this.transcode) {
      this.videoElement.nativeElement.preload = 'metadata';
    }
  }

  ngOnDestroy() {
    this.videoElement.nativeElement.src = '';
  }

  getPoster() {
    if (this.file.length) {
      return `${environment.apiUrl}/GetThumbnail?file=${this.file}&resolution=Large`;
    }
  }

  getSrc() {
    if (this.file.length) {
      if (!this.transcode) {
        return `${environment.apiUrl}/GetFile?file=${this.file}`
      } else {
        return `${environment.apiUrl}/GetFileTranscoded?file=${this.file}&quality=${this.quality}`
      }
    }
  }

  onClick() {
    const video = this.videoElement.nativeElement;
    const overlay = this.overlay.nativeElement;

    if (!video || !overlay) {
      return;
    }

    if (video.paused) {
      video.play();
      overlay.style.opacity = 0;
    } else {
      video.pause();
      overlay.style.opacity = 1;
    }
  }
}
