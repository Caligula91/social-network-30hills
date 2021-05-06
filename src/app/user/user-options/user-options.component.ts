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

    this.clearOptionsSubscription = this.userService.clearOptions$.subscribe(() => this.userForm.reset());

    this.formChangesSubscription = this.userForm.form.valueChanges.subscribe(formValue => {
      if (formValue.user && formValue.option) {
        this.userService.selectedOptions$.next({ userId: formValue.user, option: formValue.option });
      }
    })
  }

}
