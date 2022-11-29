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

  constructor(private router: Router, private authService: AuthService, private userService: UserService) {
  }

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
