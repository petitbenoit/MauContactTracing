import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter'
})
export class FilterPipe implements PipeTransform {

  transform(usersData: Array<any>, text: string ): Array<any> {

    if (text.length === 0) { return usersData; }

    return usersData.filter( user => {
        return (
          user.name.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
          user.surname.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
          user.username.toLowerCase().indexOf(text.toLowerCase()) > -1 ||
          user.role.toLowerCase().indexOf(text.toLowerCase()) > -1
        );
      });

  }

}
