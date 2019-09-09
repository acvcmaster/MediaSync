import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {

  private settings: { [id: string] : string | boolean; } = { };

  constructor() {
    this.loadFromFile(); // mock
  }

  public loadFromFile() {
    this.settings['transcode'] = false;
    this.settings['quality'] = 'Medium';
  }

  public change(key: string, value: string | boolean): boolean {
    const setting = this.settings[key];
    if (setting !== undefined && setting !== null) {
      const lastValue = this.settings[key];
      this.settings[key] = value;
      const success = this.save();
      if (!success) {
        this.settings[key] = lastValue;
      }
      return success;
    }
    return false;
  }

  public save(): boolean { // mock
    return true;
  }

  public get(key: string) {
    return this.settings[key];
  }
}
