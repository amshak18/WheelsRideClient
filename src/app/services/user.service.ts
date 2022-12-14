import {Injectable} from '@angular/core';
import api from "../resources/api.json";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly baseUrl: string = api.baseUrl;
  private readonly findEndpoint: string = api.endpoints.users.find

  constructor(private http: HttpClient) {
  }

  /**
   * This method is used to find a user by id.
   * @param id the id of the user.
   */
  findUserById(id: string): Observable<User> {
    const url: string = `${this.baseUrl}${this.findEndpoint}${id}`
    return this.http.get<User>(url);
  }

  /**
   * This method is used to delete a user by id.
   * @param id the id of the user.
   */
  deleteById(id: string): Observable<any> {
    const url: string = `${this.baseUrl}${this.findEndpoint}${id}`
    return this.http.delete(url)
  }

  /**
   * This method is used to update a user.
   * @param body the body containing the updated user information.
   */
  updateUser(body: any): Observable<User> {
    const url: string = `${this.baseUrl}${this.findEndpoint}${body._id}`
    return this.http.put<User>(url, body);
  }

  /**
   * this method is used to update the user with the isServiceProvider field set to true.
   * @param id the id of the user
   */
  registerAsProvider(id: string): Observable<User> {
    const body = {
      isServiceProvider: true
    }
    const url: string = `${this.baseUrl}${this.findEndpoint}${id}`
    return this.http.patch<User>(url, body);
  }
}
