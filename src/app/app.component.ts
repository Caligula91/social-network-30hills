import { Component, OnInit } from '@angular/core';
import { UserService } from './user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'social-network';

  constructor(private UserService: UserService) {}

  ngOnInit(): void {
    this.UserService.fetchUsers();
  }
}
