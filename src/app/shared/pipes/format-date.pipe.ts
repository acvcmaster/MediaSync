import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'formatDate'
})
export class FormatDatePipe implements PipeTransform {

  transform(value: string): string {
    const date: Date = new Date(value);
    return `${date.toLocaleDateString()} ${date.toLocaleTimeString()} (local time)`;
  }

}
