import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {MatSidenav} from "@angular/material/sidenav";
import {filter, Subscription} from "rxjs";
import {NavigationStart, Router} from "@angular/router";
import {MatDialog} from "@angular/material/dialog";

import {MatSnackBar} from "@angular/material/snack-bar";
import {ConfirmComponent} from '../confirm/confirm.component';
import {AuthService} from "../../../services/auth.service";
import {RequestsService} from "../../../services/requests.service";
import {ServiceRequest} from "../../../models/serviceRequest";
import {User} from 'src/app/models/user';

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.css']
})
export class SidenavComponent implements OnInit, OnDestroy {

  /**
   * Taking as input the sidenav component so that it can be controlled based on different event
   */
  @Input() sidenav!: MatSidenav;

  /**
   * The subscription used to listen to SideNav openChanged events
   */
  navOpenSubscription!: Subscription;

  /**
   * The subscription used to listen to router path changed events.
   */
  routerSubscription!: Subscription;

  serviceRequests: ServiceRequest[] = []
  user: User = new User()

  constructor(
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private requestService: RequestsService) {
  }

  /**
   * Method used to show an alert to the user if they click the delete event button.
   * If the user confirms deletion, the event is deleted from local storage.
   * @param tripId the id of the trip that needs to be deleted.
   */
  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.deleteRequest(id);
        this.snackBar.open("Your ride was deleted", "OK", {
          duration: 3000
        })
      }
    })
  }

  getUserRequests() {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getLoggedInUser();
      this.requestService.findAllRequestedBy(this.user._id!).subscribe({
        next: (serviceRequests) => {
          this.serviceRequests = serviceRequests;
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }

  deleteRequest(id: string) {
    if (this.authService.isLoggedIn()) {
      this.requestService.deleteOne(id).subscribe({
        next: (serviceRequest) => {
          this.serviceRequests = this.serviceRequests.filter(request => request._id !== serviceRequest._id);
        },
        error: (error) => {
          console.log(error);
        }
      })
    }
  }


  /**
   * Used to initalize the component.
   * Here, we listen to router events. so that when the route changes,
   * we can be sure that the user clicked on a trip and we can close the drawer
   *
   * We also listen to MatSideNav openedChange event.
   * So that every time the drawer is opened or closed, we can refresh the data and the drawer stays uptodate.
   */
  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getLoggedInUser();
    }
    this.routerSubscription = this.router.events.pipe(
      filter((event) => event instanceof NavigationStart))
      .subscribe(() => {
        this.sidenav.close();
      });

    this.navOpenSubscription = this.sidenav.openedChange.subscribe((opened) => {
      this.getUserRequests();
    })
  }

  /**
   * When the component is destroyed we want to unsubscribe from all the subscriptions.
   */
  ngOnDestroy() {
    this.routerSubscription.unsubscribe();
    this.navOpenSubscription.unsubscribe();
  }

}
