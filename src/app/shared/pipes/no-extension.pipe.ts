import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noExtension'
})
export class NoExtensionPipe implements PipeTransform {

  transform(value: string): string {
    const dotIndex = value.lastIndexOf('.');
    if (dotIndex == -1) {
      return value;
    }
    return value.substring(0, dotIndex);
  }
}
