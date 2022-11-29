import {Component, OnInit} from '@angular/core';
import {FormBuilder, Validators} from "@angular/forms";
import {User} from "../../../models/user";
import {AuthService} from "../../../services/auth.service";
import {AuthResponse} from "../../../models/auth/authResponse";
import {Router} from "@angular/router";
import {BreakpointObserver, Breakpoints, BreakpointState} from "@angular/cdk/layout";
import {StepperOrientation} from "@angular/cdk/stepper";

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {
  private readonly userInfoKey: string = "userInfo";
  private readonly jwtTokenKey: string = "jwtToken";
  isHandsetPortrait = false;
  isHandsetLandscape = false;
  isWebPortrait = false;
  isWebLandscape = false;
  orientation: StepperOrientation = 'horizontal'

  hide = true;
  user: any = new User();

  usernamePasswordFormGroup = this.formBuilder.group({
    usernamePasswordControl: ['', Validators.required]
  })
  userInfoFormGroup = this.formBuilder.group({
    userInfoControl: ['', Validators.required]
  });
  addressFormGroup = this.formBuilder.group({
    addressControl: ['', Validators.required]
  })

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private responsive: BreakpointObserver
  ) {

  }

  signUp() {
    if (this.user.canRegister()) {
      const userPass = this.user.password;
      this.authService.signUp(this.user).subscribe({
        next: (user: User) => {
          this.authService.login(this.user.username!, userPass!).subscribe({
            next: (authResponse: AuthResponse) => {
              const jwtToken = authResponse.token.split(" ")[1];
              const authUser = authResponse.user;
              localStorage.setItem(this.jwtTokenKey, jwtToken);
              localStorage.setItem(this.userInfoKey, JSON.stringify(authUser));
              this.router.navigate([""]);
            },
            error: (error) => {
              console.log(JSON.stringify(error));
            }
          })
        },
        error: (error) => {
          console.log(JSON.stringify(error));
        }
      })
    }
  }

  ngOnInit(): void {
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
  }

}
