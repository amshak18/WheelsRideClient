import {Component, OnDestroy, OnInit} from '@angular/core';
import {RequestsService} from "../../../services/requests.service";
import {ServiceRequest} from "../../../models/serviceRequest";
import {AuthService} from "../../../services/auth.service";
import {User} from "../../../models/user";
import {Router} from "@angular/router";

@Component({
  selector: 'app-avaiable-requests',
  templateUrl: './avaiable-requests.component.html',
  styleUrls: ['./avaiable-requests.component.css']
})
export class AvaiableRequestsComponent implements OnInit, OnDestroy {
  watchId!: NodeJS.Timer;
  acceptedWatchId!: NodeJS.Timer;
  completedWatchId!: NodeJS.Timer;

  /**
   * this is the constructor of the component where the required services is injected for the component to use.
   * @param router the angular router used to perform navigations.
   * @param requestService the request service used to update and fetch the different servicerequests
   * @param authService the auth service to get the user information.
   */
  constructor(private router: Router, private requestService: RequestsService, private authService: AuthService) {
  }

  serviceRequests: ServiceRequest[] = [];
  acceptedServiceRequests: ServiceRequest[] = [];
  completedServiceRequests: ServiceRequest[] = [];

  /**
   * This method get the available requests for the provider
   * by making use of the request service
   */
  getAvaialableRequests() {
    this.requestService.findAll().subscribe({
      next: (requests) => {
        this.serviceRequests = requests;
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  /**
   * This method will fetch all the accepted requests from the service provider
   * by making use of the requestService.
   */
  getAcceptedRequests() {
    if (this.authService.isLoggedIn()) {
      const user: User = this.authService.getLoggedInUser();
      this.requestService.findAllAccepted(user._id!).subscribe({
        next: (acceptedRequests) => {
          this.acceptedServiceRequests = acceptedRequests;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  /**
   * This method will fetch all the completed requests
   * by making use of the request service.
   */
  getCompletedRequests() {
    if (this.authService.isLoggedIn()) {
      const user: User = this.authService.getLoggedInUser();
      this.requestService.findAllCompleted(user._id!).subscribe({
        next: (acceptedRequests) => {
          this.completedServiceRequests = acceptedRequests;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  /**
   * This method will update the status of the request.
   * The service provider can accept the request or complete an accepted request.
   * In both these cases, this method will be called to appropriately handle the status update of the service request.
   * @param requestId the serviceRequest id
   * @param i the index of the serviceRequest in the array of requests
   * @param status the status to update the request. Either 'IN PROGRESS' or 'COMPLETED'
   */
  updateRequest(requestId: string, i: number, status: string) {
    if (this.authService.isLoggedIn()) {
      const user = this.authService.getLoggedInUser();
      const body = {
        provider: user._id,
        _id: requestId,
        status: status
      }
      this.requestService.update(body).subscribe({
        next: (serviceRequest) => {
          switch (status) {
            case 'IN PROGRESS':
              this.serviceRequests[i] = serviceRequest;
              break;
            case 'COMPLETED':
              this.acceptedServiceRequests[i] = serviceRequest;
              break;
            default:
              throw new Error("Invalid status");
          }

        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }

  /**
   * This method will make use of the updateRequest method to set the status of the request to 'IN PROGRESS'
   * @param requestId the serviceRequest id
   * @param i the index of the serviceRequest in the array of requests.
   */
  acceptRequest(requestId: string, i: number) {
    this.updateRequest(requestId, i, 'IN PROGRESS');
  }

  /**
   * This method will make use of the updateRequest method to set the status of the request to 'COMPLETED'
   * @param requestId the serviceRequest id
   * @param i the index of the serviceRequest in the array of requests.
   */
  completeRequest(requestId: string, i: number) {
    this.updateRequest(requestId, i, 'COMPLETED');
  }

  /**
   * This method will be called every time the angular component will be loaded on screen.
   * This is an angular lifecycle method
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.watchId = setInterval(() => {
        this.getAvaialableRequests();
      }, 3000);

      this.acceptedWatchId = setInterval(() => {
        this.getAcceptedRequests();
      }, 3000);

      this.completedWatchId = setInterval(() => {
        this.getCompletedRequests();
      }, 3000);
    } else {
      this.router.navigate(["/signin"])
    }

  }

  /**
   * This method will be called everytime the angular component will be taken off the screen
   * This is an angular component lifecycle method and will be used to perform cleanup.
   * In the case of this component, it will be used to clear all the different setIntervals
   */
  ngOnDestroy() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
    if (this.acceptedWatchId) {
      clearInterval(this.acceptedWatchId);
    }
    if (this.completedWatchId) {
      clearInterval(this.completedWatchId);
    }
  }

}
