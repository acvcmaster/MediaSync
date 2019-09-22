import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SettingsService } from './api/settings.service';
import { environment } from 'src/environments/environment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppService } from './app.service';
import { DownloadService } from './api/download.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {

  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private settingsService: SettingsService,
    private screenOrientation: ScreenOrientation,
    private appService: AppService,
    private downloadService: DownloadService
  ) {
    this.initializeApp();
    this.getApiUrlChanges();
    this.getBrowserDownloads();
    environment.apiUrl = `http://${this.settingsService.get('serverIp')}:8080/api/File`;
    this.screenOrientation.lock('portrait').catch(() => this.appService.nativeWarning('ScreenOrientation.lock'));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private getApiUrlChanges() {
    this.settingsService.settingsChanged.subscribe(() => {
      environment.apiUrl = `http://${this.settingsService.get('serverIp')}:8080/api/File`;
    });
  }

  private getBrowserDownloads() {
    this.downloadService.changed.subscribe((value) => {
      if (value) {
        const file = value as string;
        const invisibleAnchor = document.createElement('a');
        document.body.appendChild(invisibleAnchor);
        invisibleAnchor.hidden = true;
        invisibleAnchor.href = this.downloadService.blobStorage[file];
        invisibleAnchor.download = file;
        invisibleAnchor.click();
      }
    });
  }
}
