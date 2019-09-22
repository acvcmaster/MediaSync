import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: { [id: string]: string | boolean; } = { };
  private cacheDir: string;
  private settingsDir: string;
  public settingsChanged: Subject<unknown> = new Subject();

  constructor(private file: File) {
    this.cacheDir = this.file.cacheDirectory;
    if (this.cacheDir) {
      this.settingsDir = `${this.cacheDir}settings`;
      this.loadFromFile();
    } else {
      this.defaultValues();
    }
  }

  public loadFromFile() {
    this.file.listDir(this.cacheDir, 'settings').then((values) => {
      const result = values.find((value) => value.name === 'settings') !== undefined;
      if (result) {
        this.getObject(); // file already exists
      } else {
        this.initializeSettings(); // initialize file with default values
      }
    }).catch(() => this.initializeSettings());
  }

  private initializeSettings() {
    // First time default settings
    this.defaultValues();
    this.save();
  }

  private defaultValues() {
    // tslint:disable:no-string-literal
    this.settings['transcode'] = false;
    this.settings['quality'] = 'High';
    this.settings['serverIp'] = 'localhost';
    this.settings['hardwareAcceleration'] = false;
    this.settings['changeContainersOnly'] = false;
    this.settingsChanged.next();
  }

  public changeIf(key: string, value: string | boolean, condition: (value: string | boolean) => boolean) {
    if (condition(value)) {
      this.change(key, value);
    }
  }

  public change(key: string, value: string | boolean) {
    const setting = this.settings[key];
    if (setting !== undefined && setting !== null) {
      this.settings[key] = value;
      this.settingsChanged.next();
      if (this.cacheDir) {
        this.save();
      }
    }
  }

  public save(): boolean {
    let result = false;
    this.file.checkDir(this.cacheDir, 'settings').then(() => {
      this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true }).then(() => result = true);
    }).catch(() => {
      this.file.createDir(this.cacheDir, 'settings', false).then(() => {
        this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true }).then(() => result = true);
      });
    });
    return result;
  }

  private getText(): string {
    return JSON.stringify(this.settings);
  }

  private getObject() {
    this.file.readAsText(this.settingsDir, 'settings').then((contents) => {
      this.settings = JSON.parse(contents);
      this.settingsChanged.next();
    });
  }

  public get(key: string) {
    return this.settings[key];
  }
}
