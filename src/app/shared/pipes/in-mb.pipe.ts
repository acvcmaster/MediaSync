import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'inMB'
})
export class InMBPipe implements PipeTransform {

  transform(value: number): string {
    const MB: number = value / (1024 * 1024);
    return `${MB.toFixed(2)} MB`;
  }

}
