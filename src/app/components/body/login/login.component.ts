import {Component, OnInit} from '@angular/core';
import {AuthService} from "../../../services/auth.service";
import * as _ from 'lodash';
import {Router} from "@angular/router";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  private readonly jwtTokenKey: string = "jwtToken";
  private readonly userInfoKey: string = "userInfo";

  jwtToken = localStorage.getItem(this.jwtTokenKey);
  hide = true;
  username = '';
  password = '';
  user: any;

  /**
   * This is the component constructor where all the required services can be injected.
   * @param authService the AuthService to get the logged-in user information.
   * @param router the angular router to perform navigation
   * @param snackBar the MatSnackBar
   */
  constructor(private authService: AuthService, private router: Router, private snackBar: MatSnackBar) {
  }

  /**
   * This is an angular lifecycle method called everytime the component is loaded on screen.
   */
  ngOnInit(): void {
    if (this.jwtToken) {
      this.router.navigate([""]);
    }
  }

  /**
   * This method is used to log in.
   * Once the login is successful, the jwt token and the user information will be saved to local storage
   */
  login() {
    if (!_.isEmpty(this.username) && !_.isEmpty(this.password)) {
      // @ts-ignore
      this.authService.login(this.username, this.password).subscribe({
        next: (authResponse) => {
          this.jwtToken = authResponse.token.split(" ")[1];
          this.user = authResponse.user;
          localStorage.setItem(this.jwtTokenKey, this.jwtToken);
          localStorage.setItem(this.userInfoKey, JSON.stringify(this.user));
          this.router.navigate([""]);
        },
        error: (error) => {

          this.snackBar.open(error.error.message, 'OK', {
            duration: 3000
          })
          console.log(JSON.stringify(error));
        }
      })
    }
  }

}
