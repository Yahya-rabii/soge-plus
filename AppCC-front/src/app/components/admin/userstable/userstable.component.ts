import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NgxPaginationModule } from 'ngx-pagination';
import { User } from '../../../models/user.model';
import { UsersService } from '../../../services/user.service';
@Component({
  selector: 'app-usertable',
  standalone: true,
  imports: [CommonModule, NgxPaginationModule],
  templateUrl: './userstable.component.html',
  styleUrl: './userstable.component.css',
})
export class UserstableComponent {
  users: User[] = [];
  p: number = 1;
  length: number = 0;
  itemsPerPage: number = 5;
  constructor(private userService: UsersService) {}
  ngOnInit() {
    this.getUsers();
  }
  getUsers() {
    this.userService.getUsers().then((data) => {
      if (data) {
        this.users = data;
      } else {
        this.users = [];
      }
    });
  }
  getLength(): number {
    return this.users.length;
  }
}
