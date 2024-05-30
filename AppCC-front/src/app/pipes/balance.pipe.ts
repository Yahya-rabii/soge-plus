import { Pipe, PipeTransform } from '@angular/core';
@Pipe({
  name: 'balance',
  pure: true,
  standalone: true,
})
export class BalancePipe implements PipeTransform {
  transform(value: Number): string {
    return value + ' $';
  }
}
