import {Component, OnDestroy, OnInit} from '@angular/core';
import {Router} from "@angular/router";
import * as _ from "lodash";
import {LocationService} from "../../services/location.service";
import {GeocodeResponse} from "../../models/mapquest/response/geocodeResponse";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {first} from "rxjs";
import {RequestsService} from "../../services/requests.service";
import {User} from "../../models/user";
import {AuthService} from "../../services/auth.service";
import {LatLng} from "../../models/latLng";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-body',
  templateUrl: './body.component.html',
  styleUrls: ['./body.component.css']
})
export class BodyComponent implements OnInit {

  isHandsetPortrait = false;
  isHandsetLandscape = false;
  isWebPortrait = false;
  isWebLandscape = false;

  jwtToken = localStorage.getItem("jwtToken");
  searchFrom: string = "";
  searchTo: string = "";
  currentLong: number = 0;
  currentLat: number = 0;
  resultsLoading = false;
  serviceRequested = false;
  from: LatLng = new LatLng();
  to: LatLng = new LatLng();

  user: User = new User();

  constructor(
    private router: Router,
    private responsive: BreakpointObserver,
    private snackBar: MatSnackBar,
    private locationService: LocationService,
    private requestService: RequestsService,
    private authService: AuthService
  ) {
  }

  canSearch() {
    return !_.isEmpty(this.searchFrom) && !_.isEmpty(this.searchTo)
  }

  getCurrentLocation() {
    this.locationService
      .getCurrentLocation()
      .pipe(first())
      .subscribe({
        next: (position: GeolocationPosition) => {
          this.currentLong = position.coords.longitude;
          this.currentLat = position.coords.latitude;
          this.from.lng = this.currentLong;
          this.from.lat = this.currentLat;
          this.locationService.lookupLocationName(this.currentLat, this.currentLong).subscribe({
            next: (result: GeocodeResponse) => {
              // @ts-ignore
              this.searchFrom = `${result.results[0].locations[0].street}, ${result.results[0].locations[0].adminArea5}, ${result.results[0].locations[0].adminArea3}, ${result.results[0].locations[0].adminArea1}`
            },
            error: (error) => {
              console.log(JSON.stringify(error));
            }
          })
        },
        error: (error) => {
          console.log(JSON.stringify(error))
        }
      })
  }

  searchResults() {
    if (this.authService.isLoggedIn()) {
      this.resultsLoading = true;
      this.locationService.lookupLatLong(this.searchTo).subscribe({
        next: (response) => {
          // @ts-ignore
          this.to.lat = response.results[0].locations[0].latLng.lat;
          // @ts-ignore
          this.to.lng = response.results[0].locations[0].latLng.lng;

          let user = this.authService.getLoggedInUser();
          let body = {
            userId: user._id,
            service: {
              from: this.from,
              to: this.to,
              fromString: this.searchFrom,
              toString: this.searchTo,
              requestedDate: new Date()
            }
          }

          this.requestService.request(body).subscribe({
            next: (serviceRequest) => {
              this.serviceRequested = true;
              this.snackBar.open("Service Created! We will let you know once your ride is ready.", "OK", {duration: 5000});
              this.router.navigate(['/details'], {
                state: {
                  data: {
                    from: this.searchFrom,
                    to: this.searchTo,
                    data: serviceRequest
                  }
                }
              })
            },
            error: (error) => {
              console.log(error);
            }
          })
        },
        error: (error) => {
          console.log(error)
        }
      })


    }
  }

  ngOnInit(): void {

    if (!this.jwtToken) {
      this.router.navigate(['/signin']);
    }

    this.responsive.observe([
      Breakpoints.HandsetPortrait,
      Breakpoints.HandsetLandscape,
      Breakpoints.WebPortrait,
      Breakpoints.WebLandscape])
      .subscribe({
        next: (result: BreakpointState) => {
          const breakpoints = result.breakpoints;
          this.isHandsetPortrait = false;
          this.isHandsetLandscape = false;
          this.isWebPortrait = false;
          this.isWebLandscape = false;
          if (breakpoints[Breakpoints.HandsetPortrait]) {
            console.log("Handset Portrait");
            this.isHandsetPortrait = true;

          }
          if (breakpoints[Breakpoints.HandsetLandscape]) {
            console.log("Handset Landscape");
            this.isHandsetLandscape = true;
          }
          if (breakpoints[Breakpoints.WebPortrait]) {
            console.log("Web Portrait");
            this.isWebPortrait = true;
          }
          if (breakpoints[Breakpoints.WebLandscape]) {
            console.log("Web Landscape");
            this.isWebLandscape = true;
          }
        }
      });
  }
}
