import {Injectable} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import api from "../resources/api.json";
import {Observable} from "rxjs";
import {Vehicle} from "../models/vehicle";
import * as _ from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class VehicleService {
  private readonly registerEndpoint: string = api.endpoints.vehicle.registration;
  private readonly vehiclesUserEndpoint: string = api.endpoints.vehicle.find;
  private readonly vehicleEndpoint: string = api.endpoints.vehicle.vehicle;

  constructor(private http: HttpClient) {
  }

  register(body: any): Observable<Vehicle> {
    return this.http.post<Vehicle>(this.registerEndpoint, body);
  }

  getVehiclesForUser(userId: string): Observable<Vehicle[]> {
    const url: string = `${this.vehiclesUserEndpoint}/${userId}`;
    return this.http.get<Vehicle[]>(url);
  }

  updateVehicle(vehicle: Vehicle): Observable<Vehicle> {
    const url: string = `${this.vehicleEndpoint}/${vehicle._id}`;
    let clonedVehicle:any = _.cloneDeep(vehicle);
    for (let key in clonedVehicle) {
      if (key == 'vehicleOwner' || key == 'vehicleCurrentPosition' || key == 'vehicleLocation') {
        clonedVehicle[key] = clonedVehicle[key]!._id!;
      }
    }
    return this.http.put<Vehicle>(url, clonedVehicle)
  }

  deleteVehicle(id: string): Observable<any> {
    const url: string = `${this.vehicleEndpoint}/${id}`;
    return this.http.delete<any>(url);
  }
}
