import { Component, ViewChild, AfterViewInit } from '@angular/core';
import { IonToggle, IonSelect, ToastController } from '@ionic/angular';
import { SettingsService } from '../api/settings.service';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements AfterViewInit {

  @ViewChild('transcodingToggle', { static: false }) transcodingToggle: IonToggle;
  @ViewChild('qualitySelector', { static: false }) qualitySelector: IonSelect;

  constructor(private settingsService: SettingsService, private toastController: ToastController) {}

  ngAfterViewInit() {
    this.transcodingToggle.checked = this.settingsService.get('transcode') as boolean;
    this.qualitySelector.value = this.settingsService.get('quality') as string;
  }

  onTranscodeChange() {
    this.settingsService.change('transcode', this.transcodingToggle.checked);
  }

  onQualityChange() {
    this.settingsService.change('quality', this.qualitySelector.value);
  }

  transcodeToast() {
    const message = 'Transcoding improves compatibility at the cost ' +
      'of heavy CPU and memory usage in the server. This in turn limits the ' +
      'number of concurrent transcoded streams that are possible. Enable ' +
      'this only if you\'re having playback issues, or if playback is not possible.';
    this.toastController.create({
      message: message,
      duration: 10000
    }).then((toast) => toast.present());
  }
}
