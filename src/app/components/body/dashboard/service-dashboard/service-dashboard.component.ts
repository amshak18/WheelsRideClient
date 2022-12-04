import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {User} from "../../../../models/user";
import {VehicleService} from "../../../../services/vehicle.service";
import {Vehicle} from "../../../../models/vehicle";
import * as _ from 'lodash';
import {MatAccordion} from '@angular/material/expansion';
import {ConfirmComponent} from "../../confirm/confirm.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";

@Component({
  selector: 'app-service-dashboard',
  templateUrl: './service-dashboard.component.html',
  styleUrls: ['./service-dashboard.component.css']
})
export class ServiceDashboardComponent implements OnInit {
  @ViewChild(MatAccordion) accordion!: MatAccordion;
  @Input() user!: User;
  vehicles: Vehicle[] = [];
  edits: boolean[] = [];
  editing: boolean = false;

  /**
   * This is the component constructor where all the required services can be injected.
   * @param dialog the MatDialog
   * @param snackBar the MatSnackBar
   * @param vehicleService the vehicleService used to get, update and delete information about the vehicle
   */
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private vehicleService: VehicleService) {
  }

  /**
   * This method is used to update the details of the vehicle.
   * @param vehicle the vehicle object that contains information about the vehicle
   */
  updateVehicle(vehicle: Vehicle) {
    this.vehicleService.updateVehicle(vehicle).subscribe({
      next: (vehicle: Vehicle) => {
        let index = this.vehicles.findIndex(v => v._id === vehicle._id);
        this.vehicles[index] = vehicle;
        this.snackBar.open("Your vehicle was updated", "OK", {
          duration: 3000
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  /**
   * this method is used to show a confirmation dialog using MatDialog before deleting.
   * @param id the id of the vehicle to be deleted.
   */
  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.deleteVehicle(id);
      }
    })
  }

  /**
   * This method is used to delete the vehicle
   * @param id the id of the vehicle to be deleted.
   */
  deleteVehicle(id: string) {
    this.vehicleService.deleteVehicle(id).subscribe({
      next: (response) => {
        this.vehicles = this.vehicles.filter(v => v._id !== id);
        this.snackBar.open("Your vehicle was deleted", "OK", {
          duration: 3000
        })
      },
      error: (error) => {
        console.log(error)
      }
    })
  }

  /**
   * This is an angular lifecycle method called everytime the component is on screen
   */
  ngOnInit(): void {
    if (this.user) {
      const userId: string = _.get(this.user, '_id')!;
      this.vehicleService.getVehiclesForUser(userId).subscribe({
        next: (vehicles) => {
          this.vehicles = [...vehicles];
          for (let i = 0; i < this.vehicles.length; i++) {
            this.edits[i] = false;
          }
        },
        error: (error) => {
          console.log(error)
        }
      })
    }
  }

}
