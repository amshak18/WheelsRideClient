import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {SigninComponent} from "./components/body/signin/signin.component";
import {BodyComponent} from "./components/body/body.component";
import {ServiceRegisterComponent} from "./components/body/service-register/service-register.component";
import {DashboardComponent} from "./components/body/dashboard/dashboard.component";
import {AvaiableRequestsComponent} from "./components/body/avaiable-requests/avaiable-requests.component";
import {RequestDetailsComponent} from "./components/body/request-details/request-details.component";

const routes: Routes = [
  {
    path: "", component: BodyComponent
  },
  {
    path: "signin", component: SigninComponent
  },
  {
    path: "service/register", component: ServiceRegisterComponent
  },
  {
    path: "dashboard", component: DashboardComponent
  },
  {
    path: "requests", component: AvaiableRequestsComponent
  },
  {
    path: "details", component: RequestDetailsComponent
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
