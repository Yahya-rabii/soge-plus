import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

// import mat MatPaginator
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';

@Component({
  selector: 'app-usertable',
  standalone: true,
  imports: [CommonModule  , NgxPaginationModule],
  templateUrl: './userstable.component.html',
  styleUrl: './userstable.component.css'
})
export class UserstableComponent {

  users : User[] = [];
  p: number = 1; // Current page number
  length: number = 0; // Number of items in the array
  itemsPerPage: number = 5; // Number of items to display per page
  constructor(private UsersService:UsersService) { }

  ngOnInit() {
    this.getUsers();
  }

  // get users from the service
  getUsers() {
   this.UsersService.getUsers().then((data) => {
      if (data) {
        this.users = data;
      }
      else {
        this.users = [];
      }
    });
  }
  
getLength(): number {
  return this.users.length;
}

}