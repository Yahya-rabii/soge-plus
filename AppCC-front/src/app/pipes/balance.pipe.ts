import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'balance',
  pure: true, // Set pure to true to ensure the pipe is stateless
  standalone: true

})
export class BalancePipe implements PipeTransform {
  transform(value: Number): string {
  
        // this pipe will return the balance with the currency symbol 
        return value + ' $';
    
  }
}

