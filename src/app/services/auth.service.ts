import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import api from "../resources/api.json";
import {Observable} from "rxjs";
import {AuthResponse} from "../models/auth/authResponse";
import {User} from '../models/user';
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly jwtTokenKey: string = "jwtToken";
  private readonly userInfoKey: string = "userInfo";

  private readonly baseUrl: string = api.baseUrl;
  private readonly loginEndpoint: string = api.endpoints.auth.login;
  private readonly signupEndpoint: string = api.endpoints.auth.signup;

  private user: User = new User();

  constructor(private http: HttpClient) {
  }

  login(username: string, password: string): Observable<AuthResponse> {
    const loginUrl = `${this.baseUrl}${this.loginEndpoint}`
    return this.http.post<AuthResponse>(this.loginEndpoint, {username, password})
  }

  signUp(user: User): Observable<User> {
    const signUpUrl = `${this.baseUrl}${this.signupEndpoint}`
    return this.http.post<User>(this.signupEndpoint, user)
  }

  logout() {
    localStorage.removeItem(this.jwtTokenKey);
    localStorage.removeItem(this.userInfoKey);
    location.reload();
  }

  isLoggedIn(): boolean {
    const jwtToken = localStorage.getItem(this.jwtTokenKey);
    let user: User = new User();
    if (!_.isEmpty(jwtToken)) {
      let storedUser = JSON.parse(localStorage.getItem(this.userInfoKey)!);
      user._id = storedUser._id;
      user.username = storedUser.username;
      user.firstName = storedUser.firstName;
      user.lastName = storedUser.lastName;
      user.emailId = storedUser.emailId;
      user.phoneNumber = storedUser.phoneNumber;
      user.isServiceProvider = storedUser.isServiceProvider || false;

      this.user = _.cloneDeep(user);
    }

    return !_.isEmpty(jwtToken) && user.isPresent();
  }

  getLoggedInUser(): User {
    if (this.isLoggedIn()) {
      return this.user;
    }
    return new User();
  }
}
