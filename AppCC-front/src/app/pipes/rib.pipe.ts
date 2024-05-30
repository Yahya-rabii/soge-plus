import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'rib',
  pure: true,
  standalone: true,
})
export class RibPipe implements PipeTransform {
  transform(value: String): string {
    let ribFormatted = '';
    for (let i = 0; i < value.toString().length; i++) {
      if (i % 4 === 0 && i !== 0) {
        ribFormatted += ' ';
      }
      ribFormatted += value.toString()[i];
    }
    return ribFormatted;
  }
}
