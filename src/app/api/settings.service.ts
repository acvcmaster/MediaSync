import { Injectable } from '@angular/core';
import { File } from '@ionic-native/file/ngx';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: { [id: string] : string | boolean; } = { };
  private dataDir: string;
  private settingsDir: string;
  public settingsChanged: Subject<unknown> = new Subject();

  constructor(private file: File) {
    this.dataDir = this.file.dataDirectory;
    this.settingsDir = `${this.dataDir}settings`; 
    this.loadFromFile();
  }

  public loadFromFile() {
    this.file.listDir(this.dataDir, 'settings').then((values) => {
      const result = values.find((value) => value.name === 'settings') !== undefined;
      if (result) {
        this.getObject(); // file already exists
      } else {
        this.initializeSettings(); // initialize file with default values
      }
    }).catch(_ => this.initializeSettings());
  }

  private initializeSettings() {
      // First time default settings
      this.settings['transcode'] = true;
      this.settings['quality'] = 'High';
      this.save();
  }

  public change(key: string, value: string | boolean) {
    const setting = this.settings[key];
    if (setting !== undefined && setting !== null) {
      this.settings[key] = value;
      this.settingsChanged.next();
      this.save();
    }
  }

  public save(): boolean {
    let result: boolean = false;
    this.file.checkDir(this.dataDir, 'settings').then(_ => {
      this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true }).then(_ => result = true);
    }).catch(_ => {
      this.file.createDir(this.dataDir, 'settings', false).then(_ => {
        this.file.writeFile(this.settingsDir, 'settings', this.getText(), { replace: true }).then(_ => result = true);
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
