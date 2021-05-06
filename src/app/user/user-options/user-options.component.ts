import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Observable, Subscription } from 'rxjs';
import { User } from '../user.model';
import { UserService } from '../user.service';

@Component({
  selector: 'app-user-options',
  templateUrl: './user-options.component.html',
  styleUrls: ['./user-options.component.css']
})
export class UserOptionsComponent implements OnInit, OnDestroy {

  users$!: Observable<User[]>;
  @ViewChild('userForm', { static: true }) userForm!: NgForm;
  formChangesSubscription!: Subscription;
  clearOptionsSubscription!: Subscription;

  constructor(private userService: UserService) { }

  ngOnDestroy(): void {
    this.formChangesSubscription.unsubscribe();
    this.clearOptionsSubscription.unsubscribe();
  }

  ngOnInit(): void {
    this.users$ = this.userService.users$;

    // clearing form by setting values to empty string instead of reseting form
    this.clearOptionsSubscription = this.userService.clearOptions$.subscribe(() => {
      this.userForm.setValue({
        user: '',
        option: '',
      })
    });

    // emmiting selected options
    this.formChangesSubscription = this.userForm.form.valueChanges.subscribe(formValue => {
      this.userService.selectedOptions$.next({ userId: formValue.user, option: formValue.option });
    })
  }

  /**
   * FETCH USERS FROM FILE
   */
  onRefresh(): void {
    this.userService.clearOptions$.next();
    this.userService.fetchUsers();
  }

}
