import {Options} from "./options";

export class Address {
  location: string
  options: Options

  constructor() {
    this.location = "";
    this.options = new Options();
  }
}
