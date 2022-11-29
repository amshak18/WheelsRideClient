import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';
import {AppRoutingModule} from './app-routing.module';
import {AppComponent} from './components/app.component';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HeaderComponent} from './components/header/header.component';
import {FooterComponent} from './components/footer/footer.component';
import {BodyComponent} from './components/body/body.component';
import {SigninComponent} from './components/body/signin/signin.component';
import {MatToolbarModule} from "@angular/material/toolbar";
import {MatIconModule} from "@angular/material/icon";
import {MatButtonModule} from "@angular/material/button";
import {NgbModule} from '@ng-bootstrap/ng-bootstrap';
import {FontAwesomeModule} from '@fortawesome/angular-fontawesome';
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatInputModule} from "@angular/material/input";
import {MatCardModule} from "@angular/material/card";
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {MatChipsModule} from "@angular/material/chips";
import {MatBottomSheetModule} from '@angular/material/bottom-sheet';
import {MatListModule} from "@angular/material/list";
import {MatSidenavModule} from "@angular/material/sidenav";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {MatExpansionModule} from "@angular/material/expansion";
import {MatDialogModule} from "@angular/material/dialog";
import {MatStepperModule} from '@angular/material/stepper';
import {MatProgressBarModule} from '@angular/material/progress-bar'
import {RegisterComponent} from './components/body/register/register.component';
import {LoginComponent} from './components/body/login/login.component';
import {HTTP_INTERCEPTORS, HttpClientJsonpModule, HttpClientModule} from '@angular/common/http';
import {SidenavComponent} from './components/body/sidenav/sidenav.component';
import {ConfirmComponent} from './components/body/confirm/confirm.component';
import {MatProgressSpinnerModule} from "@angular/material/progress-spinner";
import {MatMenuModule} from "@angular/material/menu";
import {ServiceRegisterComponent} from './components/body/service-register/service-register.component';
import {AuthInterceptor} from "./interceptors/AuthInterceptor";
import {LoggingInterceptor} from "./interceptors/LoggingInterceptor";
import {DashboardComponent} from './components/body/dashboard/dashboard.component';
import {ServiceDashboardComponent} from './components/body/dashboard/service-dashboard/service-dashboard.component';
import {UserProfileComponent} from './components/body/dashboard/user-profile/user-profile.component';
import {MatTabsModule} from "@angular/material/tabs";
import {AvaiableRequestsComponent} from './components/body/avaiable-requests/avaiable-requests.component';
import {RequestDetailsComponent} from './components/body/request-details/request-details.component';


@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    BodyComponent,
    SigninComponent,
    RegisterComponent,
    LoginComponent,
    SidenavComponent,
    ConfirmComponent,
    ServiceRegisterComponent,
    DashboardComponent,
    ServiceDashboardComponent,
    UserProfileComponent,
    AvaiableRequestsComponent,
    RequestDetailsComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    HttpClientJsonpModule,
    MatToolbarModule,
    MatIconModule,
    MatButtonModule,
    NgbModule,
    FontAwesomeModule,
    MatFormFieldModule,
    MatInputModule,
    MatCardModule,
    FormsModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatChipsModule,
    ReactiveFormsModule,
    MatBottomSheetModule,
    MatListModule,
    MatSidenavModule,
    MatSnackBarModule,
    MatExpansionModule,
    MatDialogModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatTabsModule
  ],
  providers: [
    {
      provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true
    },
    {
      provide: HTTP_INTERCEPTORS, useClass: LoggingInterceptor, multi: true
    }],
  bootstrap: [AppComponent]
})
export class AppModule {
}
