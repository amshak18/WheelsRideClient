import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {Router} from "@angular/router";
import {AuthService} from "../../services/auth.service";
import {UserService} from "../../services/user.service";
import {User} from "../../models/user";

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  private readonly jwtTokenKey: string = "jwtToken";
  private readonly userInfoKey: string = "userInfo";
  isUserServiceProvider = false;
  user: User = new User();
  watchId!: NodeJS.Timer;

  @Input() sidenav!: MatSidenav;

  /**
   * This is the component constructor where all the required services can be injected.
   * @param router the angular router used to perform navigations.
   * @param authService the AuthService used to perform, login, logout and get the logged-in  user information.
   * @param userService the UserService used to get the user information.
   */
  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
  }

  /**
   * Used to find if any user is logged in.
   */
  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  /**
   * this method is used to log out the user.
   * to log out a user, the local storage items are deleted.
   */
  logout() {
    localStorage.removeItem(this.jwtTokenKey);
    location.reload();
  }

  /**
   * This is used to load the status of the user.
   */
  loadUser() {
    if (this.isUserLoggedIn()) {
      this.user = this.authService.getLoggedInUser();
      this.isUserServiceProvider = this.user.isServiceProvider!;
    }
  }

  /**
   * This is an angular lifecycle method used when the component is loaded on the screen.
   * here, we call the loadUser function every second to get the updated user status..
   */
  ngOnInit(): void {
    this.watchId = setInterval(() => {
      this.loadUser()
    }, 1000)
  }

  /**
   * this is an angular lifecycle method used when the component is removed from the screen.
   * if there are any live setIntervals, this method will clear them.
   */
  ngOnDestroy() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
  }

}
