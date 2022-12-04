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

  /**
   * This is the component constructor where all the required services can be injected.
   * @param router the angular router used for navigation.
   * @param dialog the MatDialog used to displaying confirmation messages.
   * @param snackBar the MatSnackBar used to display errors.
   * @param authService the AuthService used to get the logged-in user information.
   * @param requestService the RequestService used to get the list of created serviceRequests.
   */
  constructor(
    private router: Router,
    public dialog: MatDialog,
    private snackBar: MatSnackBar,
    private authService: AuthService,
    private requestService: RequestsService) {
  }

  /**
   * Method used to show an alert to the user if they click the delete button.
   * If the user confirms deletion, the serviceRequest is deleted from local storage.
   * @param id the serviceRequest id
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

  /**
   * This method is used to get all the service requests created by the user
   */
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

  /**
   * this method is used to delete the ServiceRequest using the RequestService..
   * @param id the id of the ServiceRequest to be deleted.
   */
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
   * Used to initialize the component.
   * Here, we listen to router events. so that when the route changes,
   * we can be sure that the user clicked on a historical ride, and we can close the drawer
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
