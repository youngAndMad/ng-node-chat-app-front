import { Observable } from 'rxjs';
import { Component, OnInit } from '@angular/core';
import { UserService } from '../../services/user.service';
import { User } from 'src/app/common/model/user';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
})
export class UserListComponent implements OnInit {
  users: Observable<User[]>;

  constructor(private readonly _userService: UserService) {}

  ngOnInit(): void {
    this.users = this._userService.getAllUsers();
  }
}
