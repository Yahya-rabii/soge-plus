import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'rib',
  pure: true, // Set pure to true to ensure the pipe is stateless
  standalone: true

})
export class RibPipe implements PipeTransform {
  transform(value: String): string {
  
    // make the value in this format 1234 5678 9012 3456 knowing that the value is a 16-digit number

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

