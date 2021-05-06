import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-results',
  templateUrl: './user-results.component.html',
  styleUrls: ['./user-results.component.css']
})
export class UserResultsComponent implements OnInit, OnDestroy {

  private optionsSub!: Subscription;
  userFriends: User[] | null = null;
  friendsOfFriends: User[] | null = null;
  suggestedFriends: { user: User, mutualFriends: Set<number>} [] | null = null;

  constructor(private userService: UserService) { }

  ngOnDestroy(): void {
    this.optionsSub.unsubscribe();
  }

  ngOnInit(): void {
    this.optionsSub = this.userService.selectedOptions$.subscribe(options => {
      const userId = +options.userId;
      this.clearFields();
      switch(options.option) {
        case 'friends': {
          this.userFriends = this.userService.getUserFriends(userId);
          break;
        }
        case 'friendsOfFriends': {
          this.friendsOfFriends = this.userService.getFriendsOfFriends(userId);
          break;
        }
        case 'suggestedFriends': {
          this.suggestedFriends = this.userService.getSuggestedFriends(userId);
          break;
        }
        default: {
          break;
        }
      }
    });
  }

  onClear(): void {
    this.clearFields();
    this.userService.clearOptions$.next();
  }

  private clearFields(): void {
    this.userFriends = null;
    this.friendsOfFriends = null;
    this.suggestedFriends = null;
  }

}
