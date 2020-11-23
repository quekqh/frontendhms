import { Component, OnInit } from '@angular/core';
import { Appointment } from '../../model/appointment';
import { Leave } from '../../model/leave';

import { AppointmentService } from '../../service/appointment.service';
import { UserService } from '../../service/user.service';
import { LeaveService } from '../../service/leave.service';
import * as moment from 'moment';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  appts: Appointment[] = [];
  selectedAppts: Appointment[];

  // block dates
  startDate: Date;
  endDate: Date;

  readonly minDateValue = new Date();

  success = false;

  constructor(
    public apptService: AppointmentService,
    public userService: UserService,
    public leaveService: LeaveService,
    private router: Router
  ) {}

  ngOnInit(): void {
    if (!sessionStorage.getItem('token')) {
      this.router.navigate(['admin/login']);
    }
    this.getAllAppts();
  }

  getAllAppts() {
    this.apptService.getAppointments().subscribe({
      next: (appts) => {
        this.appts = appts;
      },
    });
  }

  formatDate(date: Date) {
    return moment(date).format('DD/MM/YYYY');
  }

  formatTime(time: string) {
    return moment(time, 'HH:mm').format('h:mm a');
  }

  deleteAppointment(id: number) {
    this.apptService.deleteAppointment(id).subscribe();
    this.getAllAppts();
  }

  resetSelectedEndDate() {
    this.success = false;
    this.endDate = new Date();
  }

  createLeave() {
    const leave = new Leave();
    const userid = sessionStorage.getItem('userId');
    leave.userId = userid ? +userid : 0;
    leave.startDate = this.startDate;
    leave.endDate = this.endDate;
    leave.startTime = this.getTimefromDate(this.startDate);
    leave.endTime = this.getTimefromDate(this.endDate);

    this.leaveService.createLeave(leave).subscribe(() => {
      this.success = true;
    });
  }

  getTimefromDate(date: Date) {
    const hour = date.getHours();
    const min = date.getMinutes();

    return min < 10 ? `${hour}:0${min}` : `${hour}:${min}`;
  }

  signOut(): void {
    this.router.navigate(['admin/login']);
    sessionStorage.clear();
  }
}
