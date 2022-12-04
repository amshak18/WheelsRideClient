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

  /**
   * This method will POST to the login endpoint of the backend server to log in and get the jwttoken.
   * @param username the username entered by the user
   * @param password the password entered by the user
   */
  login(username: string, password: string): Observable<AuthResponse> {
    const loginUrl = `${this.baseUrl}${this.loginEndpoint}`
    return this.http.post<AuthResponse>(this.loginEndpoint, {username, password})
  }

  /**
   * This method will POST to the signup endpoint to create a new user.
   * @param user the user object that contains all the user information.
   */
  signUp(user: User): Observable<User> {
    const signUpUrl = `${this.baseUrl}${this.signupEndpoint}`
    return this.http.post<User>(this.signupEndpoint, user)
  }

  /**
   * This method is used to log out.
   * The local storage is cleared.
   */
  logout() {
    localStorage.removeItem(this.jwtTokenKey);
    localStorage.removeItem(this.userInfoKey);
    location.reload();
  }

  /**
   * this method will look at the localstorage to see if the user is logged in.
   * @return true if logged in. false otherwise.
   */
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

  /**
   * This method is used to get the logged-in user.
   * @return User - if logged-in
   */
  getLoggedInUser(): User {
    if (this.isLoggedIn()) {
      return this.user;
    }
    return new User();
  }
}
