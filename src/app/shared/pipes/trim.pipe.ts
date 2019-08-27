import { Pipe, PipeTransform } from '@angular/core';
import { stringify } from '@angular/compiler/src/util';

@Pipe({
  name: 'trim'
})
export class TrimPipe implements PipeTransform {

  transform(value: string): string {
    return value.trim();
  }

}
