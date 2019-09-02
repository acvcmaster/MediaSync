import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NoExtensionPipe } from './pipes/no-extension.pipe';
import { TrimPipe } from './pipes/trim.pipe';
import { InMBPipe } from './pipes/in-mb.pipe';
import { NoDotPipe } from './pipes/no-dot.pipe';
import { FormatDatePipe } from './pipes/format-date.pipe';



@NgModule({
  declarations: [NoExtensionPipe, TrimPipe, InMBPipe, NoDotPipe, FormatDatePipe],
  imports: [
    CommonModule
  ],
  exports: [NoExtensionPipe, TrimPipe, InMBPipe, NoDotPipe, FormatDatePipe]
})
export class SharedModule { }
