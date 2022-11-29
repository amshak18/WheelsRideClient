import {ChangeDetectionStrategy, Component, OnInit} from '@angular/core';
import {StepperOrientation} from "@angular/cdk/stepper";
import {FormBuilder, Validators} from "@angular/forms";
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {Vehicle} from "../../../models/vehicle";
import * as _ from 'lodash';
import {VehicleService} from "../../../services/vehicle.service";
import {LocationService} from "../../../services/location.service";
import {LatLng} from "../../../models/latLng";
import {first} from "rxjs";
import {UserService} from 'src/app/services/user.service';
import {MatSnackBar} from "@angular/material/snack-bar";
import {AuthService} from "../../../services/auth.service";

@Component({
  selector: 'app-service-register',
  templateUrl: './service-register.component.html',
  styleUrls: ['./service-register.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ServiceRegisterComponent implements OnInit {
  private readonly jwtTokenKey: string = "jwtToken";
  private readonly userInfoKey: string = "userInfo";

  isHandsetPortrait = false;
  isHandsetLandscape = false;
  isWebPortrait = false;
  isWebLandscape = false;
  orientation: StepperOrientation = 'horizontal'

  hide = true;
  user: any;
  vehicle: any;
  registerInProgress = false;

  vehicleInfoFormGroup = this.formBuilder.group({
    vehicleInfoControl: ['', Validators.required]
  });

  vehicleAddressFormGroup = this.formBuilder.group({
    vehicleAddressControl: ['', Validators.required]
  })

  licenseInfoFormGroup = this.formBuilder.group({
    licenseInfoControl: ['', Validators.required]
  });

  constructor(
    private formBuilder: FormBuilder,
    private router: Router,
    private responsive: BreakpointObserver,
    private snackBar: MatSnackBar,
    private vehicleService: VehicleService,
    private userService: UserService,
    private locationService: LocationService,
    private authService: AuthService
  ) {
  }

  register() {
    this.registerInProgress = true;
    const body: any = {
      userId: this.user._id,
      vehicle: this.vehicle
    }
    console.log(JSON.stringify(body));
    if (!_.isEmpty(this.vehicle) && this.vehicle.canRegister()) {
      this.locationService
        .getCurrentLocation()
        .pipe(first())
        .subscribe({
          next: (position: GeolocationPosition) => {
            const latLng = new LatLng();
            latLng.lat = position.coords.latitude;
            latLng.lng = position.coords.longitude;

            this.vehicle.vehicleCurrentPosition = latLng;

            this.vehicleService.register(body).subscribe({
              next: (vehicle) => {
                console.log(JSON.stringify(vehicle));
                this.userService.registerAsProvider(body.userId).subscribe({
                  next: (user) => {
                    localStorage.setItem(this.userInfoKey, JSON.stringify(user));
                    this.registerInProgress = false;
                    this.router.navigate(["/dashboard"]);
                  },
                  error: (error) => {
                    this.registerInProgress = false;
                    console.log(error)
                    this.snackBar.open(error.error.message, 'OK', {
                      duration: 3000
                    })
                  }
                })
              },
              error: (error) => {
                this.registerInProgress = false;
                console.log(error);
                this.snackBar.open(error.error.message, 'OK', {
                  duration: 3000
                })
              }
            })
          },
          error: (error) => {
            this.registerInProgress = false;
            console.log(error);
            this.snackBar.open(error.error.message, 'OK', {
              duration: 3000
            })
          }
        })

    }
  }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.user = this.authService.getLoggedInUser();
      this.vehicle = new Vehicle();
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
              this.orientation = 'vertical';

            }
            if (breakpoints[Breakpoints.HandsetLandscape]) {
              console.log("Handset Landscape");
              this.isHandsetLandscape = true;
              this.orientation = "horizontal";
            }
            if (breakpoints[Breakpoints.WebPortrait]) {
              console.log("Web Portrait");
              this.isWebPortrait = true;
              this.orientation = 'vertical';
            }
            if (breakpoints[Breakpoints.WebLandscape]) {
              console.log("Web Landscape");
              this.isWebLandscape = true;
              this.orientation = "horizontal";
            }
          }
        });
    } else {
      this.router.navigate(["/signin"]);
    }

  }

}
