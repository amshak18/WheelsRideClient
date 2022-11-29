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

  constructor(private router: Router, private requestService: RequestsService, private authService: AuthService) {
  }

  serviceRequests: ServiceRequest[] = [];
  acceptedServiceRequests: ServiceRequest[] = [];

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

  acceptRequest(requestId: string, i: number) {
    this.updateRequest(requestId, i, 'IN PROGRESS');
  }

  completeRequest(requestId: string, i: number) {
    this.updateRequest(requestId, i, 'COMPLETED');
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.watchId = setInterval(() => {
        this.getAvaialableRequests();
      }, 3000);

      this.acceptedWatchId = setInterval(() => {
        this.getAcceptedRequests();
      }, 3000);
    }
    else{
      this.router.navigate(["/signin"])
    }

  }

  ngOnDestroy() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
    if (this.acceptedWatchId) {
      clearInterval(this.acceptedWatchId);
    }
  }

}
