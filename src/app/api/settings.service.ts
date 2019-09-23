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
      this.getObject();
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
      const previous = this.settings[key];
      this.settings[key] = value;
      this.settingsChanged.next();
      this.save().then((completed) => {
        if (!completed) {
          this.settings[key] = previous;
          this.settingsChanged.next();
        }
      }).catch(() => {
        this.settingsChanged[key] = previous;
        this.settingsChanged.next();
      });
    }
  }

  public save(): Promise<boolean> {
    if (this.cacheDir) {
      this.file.checkDir(this.cacheDir, 'settings').then(() => {
        return this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true });
      }).catch(() => {
        this.file.createDir(this.cacheDir, 'settings', false).then(() => {
          return this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true });
        });
      });
    } else {
      try {
        localStorage.setItem('mediaSync-Settings', this.getText());
      } catch {
        return Promise.resolve(false);
      }
      return Promise.resolve(true);
    }
  }

  private getText(): string {
    return JSON.stringify(this.settings);
  }

  private getObject() {
    if (this.cacheDir) {
      this.file.readAsText(this.settingsDir, 'settings').then((contents) => {
        this.settings = JSON.parse(contents);
        this.settingsChanged.next();
      });
    } else {
      const settings = localStorage.getItem('mediaSync-Settings');
      if (settings) {
        this.settings = JSON.parse(settings);
      } else {
        this.initializeSettings();
      }
    }
  }

  public get(key: string) {
    return this.settings[key];
  }
}
