import { Pipe, type PipeTransform } from '@angular/core';

@Pipe({
  name: 'appRentalPipe',
  standalone: true,
})
export class RentalPipePipe implements PipeTransform {

  transform(value: boolean): string {
    return value ? 'Pendente' : 'Concluído';
  }

}
