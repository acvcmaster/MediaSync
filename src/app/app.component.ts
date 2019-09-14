import { Component, AfterViewInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { SettingsService } from './api/settings.service';
import { environment } from 'src/environments/environment';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
import { AppService } from './app.service';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent implements AfterViewInit {
  
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private settingsService: SettingsService,
    private screenOrientation: ScreenOrientation,
    private appService: AppService
  ) {
    this.initializeApp();
    this.getApiUrlChanges();
    environment.apiUrl = `http://${this.settingsService.get('serverIp')}:8080/api/File`;
  }

  ngAfterViewInit(): void {
    this.screenOrientation.lock('portrait').catch(() => this.appService.nativeWarning('ScreenOrientation.lock'));
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }

  private getApiUrlChanges() {
    this.settingsService.settingsChanged.subscribe(_ => {
      environment.apiUrl = `http://${this.settingsService.get('serverIp')}:8080/api/File`;
    });
  }
}
