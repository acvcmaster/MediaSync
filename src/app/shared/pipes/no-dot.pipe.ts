import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'noDot'
})
export class NoDotPipe implements PipeTransform {

  transform(value: string): string {
    return value.replace('.', '');
  }

}
