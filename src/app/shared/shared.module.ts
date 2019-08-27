import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoExtensionPipe } from './pipes/no-extension.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { InMBPipe } from './pipes/in-mb.pipe';



@NgModule({
  declarations: [NoExtensionPipe, TrimPipe, InMBPipe],
  imports: [
    CommonModule
  ],
  exports: [NoExtensionPipe, TrimPipe, InMBPipe]
})
export class SharedModule { }
