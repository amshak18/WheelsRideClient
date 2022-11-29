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

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
  }

  isUserLoggedIn(): boolean {
    return this.authService.isLoggedIn();
  }

  logout() {
    localStorage.removeItem(this.jwtTokenKey);
    location.reload();
  }

  loadUser() {
    if (this.isUserLoggedIn()) {
      this.user = this.authService.getLoggedInUser();
      this.isUserServiceProvider = this.user.isServiceProvider!;
    }
  }

  ngOnInit(): void {
    this.watchId = setInterval(() => {
      this.loadUser()
    }, 1000)
  }

  ngOnDestroy() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
  }

}
