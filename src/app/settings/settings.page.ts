import { Component, ViewChild, ChangeDetectorRef, OnDestroy } from '@angular/core';
import { IonToggle, IonSelect, ToastController, IonInput } from '@ionic/angular';
import { SettingsService } from '../api/settings.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-settings',
  templateUrl: 'settings.page.html',
  styleUrls: ['settings.page.scss']
})
export class SettingsPage implements OnDestroy {

  @ViewChild('transcodingToggle', { static: false }) transcodingToggle: IonToggle;
  @ViewChild('qualitySelector', { static: false }) qualitySelector: IonSelect;
  @ViewChild('serverIpInput', { static: false }) serverIpInput: IonInput;
  @ViewChild('accelerationToggle', { static: false }) accelerationToggle: IonToggle;
  @ViewChild('containerToggle', { static: false }) containerToggle: IonToggle;
  private subscriptions: Subscription[] = [];

  constructor(public settingsService: SettingsService, private toastController: ToastController, private changeDetectorRef: ChangeDetectorRef) {
    this.subscriptions.push(this.settingsService.settingsChanged.subscribe(() => this.changeDetectorRef.detectChanges()));
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe());
  }

  onTranscodeChange() {
    this.settingsService.change('transcode', this.transcodingToggle.checked);
  }

  onQualityChange() {
    this.settingsService.change('quality', this.qualitySelector.value);
  }

  onServerIpChange() {
    this.settingsService.change('serverIp', this.serverIpInput.value);
  }

  onAccelerationChange() {
    this.settingsService.change('hardwareAcceleration', this.accelerationToggle.checked);
  }

  onContainerChange() {
    this.settingsService.change('changeContainersOnly', this.containerToggle.checked);
  }

  transcodeToast() {
    const message = 'Transcoding improves compatibility at the cost ' +
      'of heavy CPU and memory usage in the server. This in turn limits the ' +
      'number of concurrent transcoded streams that are possible. Enable ' +
      'this only if you\'re having playback issues, or if playback is not possible.';
    this.toastController.create({
      message: message,
      duration: 8000
    }).then((toast) => toast.present());
  }

  accelerationToast() {
    const message = 'Feature not implemented on API.';
    this.toastController.create({
      message: message,
      duration: 2500
    }).then((toast) => toast.present());
  }

  containerToast() {
    const message = 'Will attempt to change the media container only, without any type of ' +
      'codec conversion whatsoever. This option reduces the CPU usage in the server ' +
      'to basically zero, but playback might stop working. In that case, disable this option.';
    this.toastController.create({
      message: message,
      duration: 8000
    }).then((toast) => toast.present());
  }
}
