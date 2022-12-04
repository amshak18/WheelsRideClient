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

  /**
   * This method is used to create a service request.
   * @param body the request body containing the user and service request information.
   */
  request(body: any): Observable<ServiceRequest> {
    return this.http.post<ServiceRequest>(this.requestEndpoint, body);
  }

  /**
   * This method is used to find all the newly created service requests.
   */
  findAll(): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        status: 'NEW'
      }
    });
  }

  /**
   * this method is used to find all the accepted service requests from a provider.
   * @param userId the user id of the provider.
   */
  findAllAccepted(userId: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        status: 'IN PROGRESS',
        provider: userId
      }
    });
  }

  /**
   * this method is used to find all the completed service requests from a provider.
   * @param userId the userId of the provider.
   */
  findAllCompleted(userId: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        status: 'COMPLETED',
        provider: userId
      }
    });
  }

  /**
   * this method is used to find all the services requests created by a user.
   * @param userId the userId of the requester.
   */
  findAllRequestedBy(userId: string): Observable<ServiceRequest[]> {
    return this.http.get<ServiceRequest[]>(this.requestEndpoint, {
      params: {
        requestedBy: userId
      }
    });
  }

  /**
   * this method is used to update the status of the ServiceRequest
   * @param body the body containing the patch for the ServiceRequest
   */
  update(body: any): Observable<ServiceRequest> {
    console.log(JSON.stringify(body));
    const requestId = body._id;
    const url = `${this.requestEndpoint}/${requestId}`;
    return this.http.patch<ServiceRequest>(url, body);
  }

  /**
   * this method is used to find a service request by its id.
   * @param id the id of the ServiceRequest.
   */
  findOne(id: string): Observable<ServiceRequest> {
    const url: string = `${this.requestEndpoint}/${id}`;
    return this.http.get<ServiceRequest>(url)
  }

  /**
   * this method is used to delete a service request by its id.
   * @param id the id of the ServiceRequest.
   */
  deleteOne(id: string): Observable<ServiceRequest> {
    const url: string = `${this.requestEndpoint}/${id}`;
    return this.http.delete<ServiceRequest>(url)
  }
}
