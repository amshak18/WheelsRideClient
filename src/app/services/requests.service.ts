import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import api from "../resources/api.json";
import {Observable} from "rxjs";
import {ServiceRequest} from '../models/serviceRequest';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private readonly requestEndpoint: string = api.endpoints.service.request;

  constructor(private http: HttpClient) {
  }

  request(body: any): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.requestEndpoint, body);
  }

  findAll(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        status: 'NEW'
      }
    });
  }

  findAllAccepted(userId: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        status: 'IN PROGRESS',
        provider: userId
      }
    });
  }

  findAllRequestedBy(userId: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        requestedBy: userId
      }
    });
  }

  update(body: any): Observable<ServiceRequest> {
    console.log(JSON.stringify(body));
    const requestId = body._id;
    const url = `${this.requestEndpoint}/${requestId}`;
    return this.http.patch<ServiceRequest>(url, body);
  }

  findOne(id: string): Observable<ServiceRequest> {
    const url: string = `${this.requestEndpoint}/${id}`;
    return this.http.get<ServiceRequest>(url)
  }

  deleteOne(id: string): Observable<ServiceRequest> {
    const url: string = `${this.requestEndpoint}/${id}`;
    return this.http.delete<ServiceRequest>(url)
  }
}
