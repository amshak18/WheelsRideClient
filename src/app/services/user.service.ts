import {Injectable} from '@angular/core';
import api from "../resources/api.json";
import {HttpClient} from "@angular/common/http";
import {Observable} from "rxjs";
import {User} from "../models/user";

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private readonly findEndpoint: string = api.endpoints.users.find

  constructor(private http: HttpClient) {
  }

  findUserById(id: string): Observable<User> {
    return this.http.get<User>(`${this.findEndpoint}/${id}`)
  }

  findAll(): Observable<User[]> {
    return this.http.get<User[]>(this.findEndpoint);
  }

  deleteById(id: string): Observable<any> {
    const url = `${this.findEndpoint}/${id}`;
    return this.http.delete(url)
  }

  updateUser(body: any): Observable<User> {
    const url = `${this.findEndpoint}/${body._id}`;
    return this.http.put<User>(url, body);
  }

  registerAsProvider(id: string): Observable<User> {
    const body = {
      isServiceProvider: true
    }
    return this.http.patch<User>(`${this.findEndpoint}/${id}`, body);
  }
}
