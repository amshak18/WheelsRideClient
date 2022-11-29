import {Component, Input, OnInit} from '@angular/core';
import {User} from "../../../../models/user";
import * as _ from 'lodash';
import {AuthService} from "../../../../services/auth.service";
import {UserService} from "../../../../services/user.service";
import {ConfirmComponent} from "../../confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {
  @Input() user!: User;
  editing = false;
  cleanUser: User = new User();

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService) {
  }

  ngOnInit(): void {

  }

  edit() {
    if (this.user) {
      this.cleanUser = _.cloneDeep(this.user);
    }
    this.editing = !this.editing;
  }

  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.delete(id);
      }
    })
  }

  delete(id: string) {
    this.userService.deleteById(id).subscribe({
      next: (value) => {
        if (value.deletedStatus) {
          this.snackBar.open("Your account was deleted", "OK", {
            duration: 3000
          })
          this.authService.logout();
        }
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  update(user: User) {
    let clonedUser: any = _.cloneDeep(user);
    for (let key in clonedUser) {
      if (key === 'address') {
        clonedUser[key] = clonedUser[key]._id;
      }
    }
    this.userService.updateUser(clonedUser).subscribe({
      next: (user) => {
        this.user = user;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  cancel() {
    this.user = this.cleanUser;
    this.editing = false;
  }

}
