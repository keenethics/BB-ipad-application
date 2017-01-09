import { Component } from '@angular/core';
import template from './users.component.html';
import style from './users.component.scss';
import { MeteorObservable } from 'meteor-rxjs';
// import { Meteor } from 'meteor/meteor';

export interface New_User {
  emailId: string
  password: string
  name: string
  role: string
}

@Component({
  selector: 'users',
  template,
  styles: [ style ]
})
export class UsersComponent {
  new_user: New_User
  users

  save_users(){
    this.message = 'Saving users'
    let modified_users = []
    for (var i = 0; i < this.users.length; i++) {
      if(this.users[i].oldRole && this.users[i].oldRole !== this.users[i].role) {
        let obj = {
          _id: this.users[i]._id,
          role: this.users[i].role
        }
        delete this.users[i].oldRole
        modified_users.push(obj)
      }      
    }
    if(modified_users.length) {
      MeteorObservable.call('save_users', modified_users).subscribe(() => {
        console.log('Users Saved')
        this.message = 'Users Saved'
      }, (error) => {
        console.log(`Failed to save users due to  ${error}`);
        this.message = `Failed to save users due to  ${error}`
      })
    } else {
      this.message = 'Users Saved'
    }
  }
  updateRole(user, role) {
    if(!user.oldRole) user.oldRole = user.role
    user.role = role
  }
  constructor(){
    this.new_user = {}
    MeteorObservable.call('users_list').subscribe((users) => {
      this.users = users
    }, (error) => {
      console.log(`Failed to receive users list due to ${error}`);
    })
    this.new_user.role = 'Customer'
  }

  create_user() {    
    this.new_user_message = 'Creating new user'
    MeteorObservable.call('create_user', this.new_user.name, 
      this.new_user.emailId, this.new_user.password, this.new_user.role).subscribe((new_user_id) => {
        this.new_user_message = 'New user created'
        let new_user = {
          '_id': new_user_id,
          'role': this.new_user.role,
          'profile': {
            'name': this.new_user.name
          },
          'emails':[
            { address: this.new_user.emailId}
          ]
        }
        this.users.push(new_user)
    }, (error) => {
      this.new_user_message = `Failed to create user due to ${error}`
      console.log(`Failed to create user due to ${error}`);
    });
  }
}