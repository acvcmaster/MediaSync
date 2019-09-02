import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {
  
  private downloading: string[] = [];

  constructor() { }
  
  public download(file: string, onFinish?: () => void): void {
    if (this.isDownloading(file)) {
      return;
    }

    this.downloading.push(file);
    setTimeout(() => {
      this.removeDownload(file);
      this.fileSystemMock.push(file);
      if (onFinish) {
        onFinish();
      }
    }, 2000);
  }

  removeFile(file: string, onFinish: () => void) {
    const fileIndex: number = this.fileSystemMock.findIndex((elem) => elem === file);
    if (fileIndex != -1) {
      this.fileSystemMock.splice(fileIndex, 1);
    }
    onFinish();
  }

  private fileSystemMock: string[] = [];
  private onFileSystem(file: string): boolean {
    return this.fileSystemMock.findIndex((elem) => elem === file) !== -1;
  }

  public isDownloading(file: string): boolean {
    return this.downloading.findIndex((elem) => elem === file) !== -1;
  }

  public isDownloaded(file: string): boolean {
    return !this.isDownloading(file) && this.onFileSystem(file);
  }

  private removeDownload(file: string) {
    const downloadIndex: number = this.downloading.findIndex((elem) => elem === file);
    if (downloadIndex != -1) {
      this.downloading.splice(downloadIndex, 1);
    }
  }
}
