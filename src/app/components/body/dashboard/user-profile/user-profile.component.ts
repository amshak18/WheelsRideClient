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

  /**
   * This is the component constructor where all the required services can be injected.
   * @param dialog the MatDialog
   * @param snackBar the MatSnackBar
   * @param authService the AuthService to get logged-in user information
   * @param userService the UserService to all the user information
   */
  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private userService: UserService) {
  }

  /**
   * this is an angular lifecycle method called everytime the component is loaded on screen
   */
  ngOnInit(): void {

  }

  /**
   * This method is used to store a clean copy of the user when the edits are being made.
   * so it can be used to restore if the edits are canceled.
   */
  edit() {
    if (this.user) {
      this.cleanUser = _.cloneDeep(this.user);
    }
    this.editing = !this.editing;
  }

  /**
   * this method is used to show a confirmation dialog before deleting the user.
   * @param id the id of the user.
   */
  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.delete(id);
      }
    })
  }

  /**
   * this method is used to actually delete the user.
   * @param id the id of the user.
   */
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

  /**
   * this method is used to update the user
   * @param user the user object with all the updated user information.
   */
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

  /**
   * this method is used to cancel the edits made to the user object by restoring the cleanUser.
   */
  cancel() {
    this.user = this.cleanUser;
    this.editing = false;
  }

}
