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

  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private vehicleService: VehicleService) {
  }

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

  confirmDelete(id: string) {
    const dialogRef = this.dialog.open(ConfirmComponent);
    dialogRef.afterClosed().subscribe(result => {
      if (result === 'YES') {
        this.deleteVehicle(id);
      }
    })
  }

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
