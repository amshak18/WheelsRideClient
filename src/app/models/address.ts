import {State} from "./state";

export class Address {
  _id?:string;
  streetAddress1?: string;
  streetAddress2?: string;
  city?: string;
  state?: State;

  constructor() {
    this.state = new State()
  }
}
