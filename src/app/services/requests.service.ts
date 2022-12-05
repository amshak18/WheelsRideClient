import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import api from "../resources/api.json";
import {Observable} from "rxjs";
import {ServiceRequest} from '../models/serviceRequest';

@Injectable({
  providedIn: 'root'
})
export class RequestsService {

  private readonly baseUrl: string  = api.baseUrl;
  private readonly requestEndpoint: string = api.endpoints.service.request;

  constructor(private http: HttpClient) {
  }

  /**
   * This method is used to create a service request.
   * @param body the request body containing the user and service request information.
   */
  request(body: any): Observable<ServiceRequest> {
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}`
    return this.http.post<ServiceRequest>(requestUrl, body);
  }

  /**
   * This method is used to find all the newly created service requests.
   */
  findAll(): Observable<ServiceRequest[]> {
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}`
    return this.http.get<ServiceRequest[]>(requestUrl, {
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
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}`
    return this.http.get<ServiceRequest[]>(requestUrl, {
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
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}`
    return this.http.get<ServiceRequest[]>(requestUrl, {
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
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}`
    return this.http.get<ServiceRequest[]>(requestUrl, {
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
    const requestId = body._id;
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}${requestId}`
    return this.http.patch<ServiceRequest>(requestUrl, body);
  }

  /**
   * this method is used to find a service request by its id.
   * @param id the id of the ServiceRequest.
   */
  findOne(id: string): Observable<ServiceRequest> {
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}${id}`
    return this.http.get<ServiceRequest>(requestUrl)
  }

  /**
   * this method is used to delete a service request by its id.
   * @param id the id of the ServiceRequest.
   */
  deleteOne(id: string): Observable<ServiceRequest> {
    const requestUrl = `${this.baseUrl}${this.requestEndpoint}${id}`
    return this.http.delete<ServiceRequest>(requestUrl)
  }
}
