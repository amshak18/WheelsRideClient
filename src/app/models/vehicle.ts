import {Address} from "./address";
import {LatLng} from "./latLng";
import {User} from "./user";
import * as _ from "lodash";

export class Vehicle {
  _id?:string;
  vin?: string;
  vehicleName?: string;
  vehicleMake?: string;
  vehicleColor?: string;
  vehicleSeatingCapacity?: number;
  vehicleAvailableSeatingCapacity?: number;
  vehicleLicensePlateNumber?: string;
  vehicleCondition?: string;
  vehicleLocation?: Address;
  vehicleCurrentPosition?: LatLng;
  vehicleOwner?: User

  constructor() {
    this.vehicleLocation = new Address();
    this.vehicleCurrentPosition = new LatLng();
    this.vehicleOwner = new User();
  }

  canRegister() {
    return !_.isEmpty(this.vin) &&
      !_.isEmpty(this.vehicleName) &&
      !_.isEmpty(this.vehicleMake) &&
      !_.isEmpty(this.vehicleLicensePlateNumber) &&
      !_.isEmpty(this.vehicleLocation)
  }
}
