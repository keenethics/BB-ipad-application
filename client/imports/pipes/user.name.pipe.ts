import { Pipe, PipeTransform } from '@angular/core';
import {User} from "../../../both/models/users.model";

@Pipe({name: 'user'})
export class UserPipe implements PipeTransform {
  transform(user: User, param:string): string {
    if(param == 'name') {
      if(user.profile)
        return user.profile.name
      return user.username
    }
    if(param == 'role') {
      if (user.role) return user.role
      return 'Customer'
    }
  }
}