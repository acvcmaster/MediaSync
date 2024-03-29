import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail.component';
import { RouterModule, Routes } from '@angular/router';
import { IonicModule } from '@ionic/angular';
import { SharedModule } from '../shared/shared.module';
import { VideoComponent } from './video/video.component';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';


const routes: Routes = [
  {
    path: 'detail/:name',
    component: DetailComponent
  }];

@NgModule({
  declarations: [DetailComponent, VideoComponent],
  imports: [
    CommonModule,
    IonicModule,
    SharedModule,
    RouterModule.forChild(routes)
  ],
  providers: [
    ScreenOrientation
  ],
  exports: [DetailComponent]
})
export class DetailModule { }
