import {Component, OnInit} from '@angular/core';
import {User} from 'src/app/models/user';
import {AuthService} from "../../../services/auth.service";
import {UserService} from "../../../services/user.service";
import {Router} from "@angular/router";
import * as _ from 'lodash';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})
export class DashboardComponent implements OnInit {
  private readonly userInfoKey: string = "userInfo";
  private readonly jwtTokenKey: string = "jwtToken";
  user: User = new User();

  /**
   * This is the component constructor where all the required services can be injected.
   * @param router the angular router.
   * @param authService the AuthService used to get the logged-in user information
   * @param userService the UserService used to get additional user information
   */
  constructor(private router: Router,
              private authService: AuthService,
              private userService: UserService) {
  }

  /**
   * This is an angular lifecycle method called everytime the component is loaded on screen.
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      const id = _.get(JSON.parse(localStorage.getItem(this.userInfoKey)!), '_id');
      this.userService.findUserById(id).subscribe({
        next: (user) => this.user = user,
        error: (error) => console.log(error)
      })
    } else {
      this.router.navigate(["/signin"]);
    }
  }

}
