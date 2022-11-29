import {LatLng} from "./latLng";
import {User} from "./user";

export class ServiceRequest {
  _id?: string;
  from?: LatLng;
  to?: LatLng;
  fromString?: string;
  toString?: string;
  requestedBy?: User;
  provider?: User;
  requestedDate?: Date;
  totalCost?: number;
  status?: string;
  requestorComment?: string;

  constructor() {
    this.from = new LatLng();
    this.to = new LatLng();
    this.requestedBy = new User();
    this.provider = new User();
    this.requestedDate = new Date();
  }
}
