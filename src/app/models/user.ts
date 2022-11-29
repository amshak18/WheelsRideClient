import {Address} from "./address";
import * as _ from "lodash";

export class User {
  _id?: string
  username?: string;
  password?: string;
  firstName?: string;
  lastName?: string;
  emailId?: string;
  phoneNumber?: number;
  address?: Address;
  isServiceProvider?: boolean

  constructor() {
    this.address = new Address();
    this.isServiceProvider = false;
  }

  canRegister(): boolean {
    return !_.isEmpty(this.username) &&
      !_.isEmpty(this.password) &&
      !_.isEmpty(this.firstName) &&
      !_.isEmpty(this.lastName) &&
      !_.isEmpty(this.emailId)
  }

  isPresent(): boolean {
    return !_.isEmpty(this.username) &&
      !_.isEmpty(this.firstName) &&
      !_.isEmpty(this.lastName) &&
      !_.isEmpty(this.emailId)
  }
}
