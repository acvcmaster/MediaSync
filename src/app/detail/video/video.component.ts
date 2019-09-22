import { Component, Input, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-video',
  templateUrl: './video.component.html',
  styleUrls: ['./video.component.scss'],
})
export class VideoComponent implements AfterViewInit, OnDestroy {

  @Input() file: string;
  @Input() transcode = false;
  @Input() changeContainersOnly = false;
  @Input() preload = false;
  @Input() type = 'video/mp4';
  @Input() quality = 'High';
  @Input() hardwareAcceleration = false;
  @ViewChild('videoElement', { static: false }) videoElement: ElementRef;

  constructor() { }

  ngAfterViewInit() {
    if (this.preload) {
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
        return `${environment.apiUrl}/GetFile?file=${this.file}`;
      } else {
        if (!this.hardwareAcceleration) {
          return !this.changeContainersOnly ? `${environment.apiUrl}/GetFileTranscoded?file=${this.file}&quality=${this.quality}`
            : `${environment.apiUrl}/GetFileTranscoded?file=${this.file}&changeContainersOnly=${this.changeContainersOnly}`;
        } else {
          return `${environment.apiUrl}/GetFileTranscoded?file=${this.file}` +
            `&quality=${this.quality}&hardwareAcceleration=${this.hardwareAcceleration}`;
        }
      }
    }
  }
}
