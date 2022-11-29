import {Component, OnDestroy, OnInit} from '@angular/core';
import {ServiceRequest} from "../../../models/serviceRequest";
import * as _ from "lodash";
import {RequestsService} from "../../../services/requests.service";
import {Router} from "@angular/router";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-request-details',
  templateUrl: './request-details.component.html',
  styleUrls: ['./request-details.component.css']
})
export class RequestDetailsComponent implements OnInit, OnDestroy {
  serviceRequest: ServiceRequest = new ServiceRequest();
  searching = true;
  from: string = "";
  to: string = "";
  watchId!: NodeJS.Timer;

  constructor(private router: Router, private requestService: RequestsService, private authService: AuthService) {
  }

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      if (history.state.data) {
        const stateObject: ServiceRequest = history.state.data.data;
        this.from = history.state.data.from;
        this.to = history.state.data.to;
        this.serviceRequest = _.cloneDeep(stateObject);
        this.watchId = setInterval(() => {
          this.checkRequestStatus();
        }, 5000);
      }
      else{
        this.router.navigate(["/"]);
      }
    }
    else{
      this.router.navigate(["/signin"]);
    }

  }

  checkRequestStatus(): void {
    this.requestService.findOne(this.serviceRequest._id!).subscribe({
      next: (serviceRequest) => {
        this.serviceRequest = serviceRequest;
        if(serviceRequest.provider){
          this.searching = false;
          console.log(JSON.stringify(serviceRequest.provider));
        }
        if (serviceRequest.status === 'COMPLETED') {
          clearInterval(this.watchId);
        }
      },
      error: (error) => {
        if(error.error.message === 'No requests found!'){
          this.router.navigate(["/"]);
        }
        clearInterval(this.watchId);
      }
    })
  }

  ngOnDestroy() {
    if (this.watchId) {
      clearInterval(this.watchId);
    }
  }

}
