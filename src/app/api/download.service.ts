import { Injectable, SecurityContext } from '@angular/core';
import { Subject } from 'rxjs';
import { File } from '@ionic-native/file/ngx';
import { FileTransfer, FileTransferObject } from '@ionic-native/file-transfer/ngx';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { DomSanitizer } from '@angular/platform-browser';

@Injectable({
  providedIn: 'root'
})
export class DownloadService {

  private downloading: string[] = [];
  private fileSystem: string[] = [];
  private fileSystemError: string[] = [];
  private downloadQueue: any[] = [];
  public changed: Subject<unknown> = new Subject();
  private storagePath: string;
  private downloadsFolder: string;
  private mediaFolder: string;
  private downloader: FileTransferObject;
  public blobStorage: { [id: string]: string; } = { };

  // tslint:disable:deprecation
  constructor(private file: File, private fileTransfer: FileTransfer, private httpClient: HttpClient, private sanitizer: DomSanitizer) {
    this.changed.subscribe(() => {
      if (this.downloadQueue.length && this.downloading.length < 2) {
        const queueDownload = this.downloadQueue.pop();
        this.downloadFile(queueDownload.file, queueDownload.onFinish);
      }
    });
    this.storagePath = this.file.externalRootDirectory;
    this.downloadsFolder = `${this.storagePath}Download/`;
    this.mediaFolder = `${this.downloadsFolder}Media/`;
    this.downloader = this.fileTransfer.create();
    this.probeFileSystem();
  }

  public addToQueue(file: string, onFinish?: () => void): void {
    if (this.isDownloading(file)) {
      return;
    }
    this.downloadQueue.unshift({ file, onFinish });
    this.changed.next();
  }

  private downloadFile(file: string, onFinish: () => void) {
    if (this.onFileSystem(file)) {
      this.changed.next();
      return;
    }

    this.downloading.push(file);
    this.removeError(file);

    this.storagePath ? this.downloadFileAndroid(file, onFinish)
      : this.downloadFileBrowser(file, onFinish);
  }

  private downloadFileAndroid(file: string, onFinish: () => void) {
    this.checkDirectoriesAndSave(file, () => {
      if (onFinish) {
        onFinish();
      }
      this.fileSystem.push(file);
      this.removeDownload(file);
      this.changed.next();
    }, () => {
      this.fileSystemError.push(file);
      this.removeDownload(file);
      this.changed.next();
    });
  }

  checkDirectoriesAndSave(file: string, callback: () => void, onFail: () => void) {
    this.file.checkDir(this.downloadsFolder, 'Media').then(() => {
      this.downloader.download(this.getFileUrl(file), `${this.mediaFolder}${file}`).then(() => callback()).catch(() => onFail());
    }).catch(() => {
      this.file.createDir(this.downloadsFolder, 'Media', true).then(() => {
      this.downloader.download(this.getFileUrl(file), `${this.mediaFolder}${file}`).then(() => callback()).catch(() => onFail());
      }).catch(() => onFail());
    });
  }

  private downloadFileBrowser(file: string, onFinish: () => void) {
    const subscription = this.httpClient.get<Blob>(this.getFileUrl(file), { responseType: 'blob' as 'json' })
      .pipe(map((result => {
        if (result) {
          this.fileSystem.push(file);
          this.addToBlobStorage(file, result);

          if (onFinish) {
            onFinish();
          }
          this.removeDownload(file);
          this.changed.next(file);
        }
        subscription.unsubscribe();
        return result;
      }))).subscribe();
  }

  getFileUrl(file: string): string {
    return `${environment.apiUrl}/GetFile?file=${file}&raw=true`;
  }

  removeFile(file: string, onFinish: () => void) {
    if (this.storagePath) {
      this.file.removeFile(this.mediaFolder, file).then(() => {
        this.removeFromFileSystem(file, onFinish);
      });
    } else {
      this.removeFromFileSystem(file, onFinish);
    }
  }

  removeFromFileSystem(file: string, onFinish: () => void) {
    const fileIndex: number = this.fileSystem.findIndex((elem) => elem === file);
    if (fileIndex !== -1) {
      this.fileSystem.splice(fileIndex, 1);
    }
    this.removeFromBlobStorage(file);
    onFinish();
  }

  probeFileSystem() {
    this.fileSystem = [];
    if (this.storagePath) {
      this.file.listDir(this.downloadsFolder, 'Media').then((entries) => {
        this.fileSystem = entries.map((entry) => entry.name);
        this.changed.next();
      });
    }
  }

  private onFileSystem(file: string): boolean {
    return this.fileSystem.findIndex((elem) => elem === file) !== -1;
  }

  public isDownloading(file: string): boolean {
    return this.downloading.findIndex((elem) => elem === file) !== -1;
  }

  public isDownloaded(file: string): boolean {
    return !this.isDownloading(file) && this.onFileSystem(file);
  }

  public hasError(file: string): boolean {
    return this.fileSystemError.findIndex((elem) => elem === file) !== -1;
  }

  private removeDownload(file: string) {
    const downloadIndex: number = this.downloading.findIndex((elem) => elem === file);
    if (downloadIndex !== -1) {
      this.downloading.splice(downloadIndex, 1);
    }
  }

  private removeError(file: string) {
    const errorIndex: number = this.fileSystemError.findIndex((elem) => elem === file);
    if (errorIndex !== -1) {
      this.fileSystemError.splice(errorIndex, 1);
    }
  }

  public getLocalPath(file: string): Promise<string> {
    const promise = this.file.checkFile(this.mediaFolder, file);
    if (promise) {
      return promise.then((exists) => exists ? `${this.mediaFolder}${file}` : null).catch(() => null);
    }
    return Promise.resolve(null);
  }

  public addToBlobStorage(file: string, blob: Blob) {
    this.blobStorage[file] = this.sanitizer.sanitize(SecurityContext.RESOURCE_URL,
      this.sanitizer.bypassSecurityTrustResourceUrl(window.URL.createObjectURL(blob)));
  }

  public removeFromBlobStorage(file: string) {
    this.blobStorage[file] = null;
  }
}
