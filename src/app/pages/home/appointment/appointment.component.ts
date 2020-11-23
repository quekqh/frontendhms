import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Appointment, RegisterAppt } from '../../model/appointment';
import { SocialAuthService } from 'angularx-social-login';

import {
  CountryISO,
  SearchCountryField,
  TooltipLabel,
} from 'ngx-intl-tel-input';

import { AppointmentService } from '../../service/appointment.service';
import { UserService } from '../../service/user.service';
import { LeaveService } from '../../service/leave.service';
import { CustomerService } from '../../service/customer.service';

import * as moment from 'moment';
import { Customer, RegisterCustomer } from '../../model/customer';
import { User } from '../../model/user';
import { Leave } from '../../model/leave';

@Component({
  selector: 'app-appointment',
  templateUrl: './appointment.component.html',
  styleUrls: ['./appointment.component.scss'],
})
export class AppointmentComponent implements OnInit {
  subheading = '';
  appts: string[] = [];
  dateAppts = new Map<number, Date[]>();
  disabledDates: Date[] = [];
  editAppt = false;
  minDateValue: Date = new Date();
  selected_apptDate: Date = new Date();
  selected_appt: string = '';

  // Hairstylists
  users: User[] = [];
  selected_hairstylist: string = '';
  hairstylists: string[] = [];

  // Contact fields
  contactForm: FormGroup;

  // Customer field
  customerId = 0;

  // Working hours range
  readonly startTime: string = '10:00';
  readonly endTime: string = '19:00';

  // ngx-intl-tel-input fields
  SearchCountryField = SearchCountryField;
  TooltipLabel = TooltipLabel;
  CountryISO = CountryISO;
  preferredCountries: CountryISO[] = [CountryISO.Singapore];
  selected_country_iso: CountryISO = CountryISO.Singapore;

  // blocked slots
  blockedSlots: string[] = [];

  error = '';
  msgs: any[] = [];
  success = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    public apptService: AppointmentService,
    public userService: UserService,
    public leaveService: LeaveService,
    public customerService: CustomerService,
    private fb: FormBuilder,
    private authService: SocialAuthService
  ) {}

  ngOnInit() {
    window.scroll(0, 0);
    if (!sessionStorage.getItem('token')) {
      this.router.navigate(['home/login']);
    }

    // Contact form.
    this.contactForm = this.fb.group({
      name: ['', [Validators.required]],
      mobile: ['', Validators.required],
    });

    this.userService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
        this.hairstylists = users.map((user) => user.name);
      },
    });
  }

  getAllApptSlots() {
    return this.getSlotsBetweenTimeInterval(this.startTime, this.endTime);
  }

  getSlotsBetweenTimeInterval(startTime: string, endTime: string) {
    // Loop 15 mins intervals
    const tformat = 'HH:mm';
    const dformat = 'DD/MM/YYYY';

    let start = moment(startTime, tformat);
    const end = moment(endTime, tformat);

    const selectedDate = moment(this.selected_apptDate, dformat);
    const todayDate = moment(new Date(), dformat);

    // ensure bookings before current time cannot be booked
    if (selectedDate.isSame(todayDate, 'day')) {
      if (moment().isBetween(start, end)) {
        start = moment();
      }
    }

    // round starting minutes up to nearest 15 (12 --> 15, 17 --> 30)
    // note that 59 will round up to 60, and moment.js handles that correctly
    start.minutes(Math.ceil(start.minutes() / 15) * 15);

    const result: string[] = [];

    const current = moment(start);

    while (current <= end) {
      result.push(current.format('HH:mm'));
      current.add(15, 'minutes');
    }

    return result;
  }

  addToBlockedSlots(slots: string[]) {
    this.blockedSlots = this.blockedSlots.concat(slots);
  }

  removeUnavailableSlots(unavailableSlots: string[]) {
    const apptSlots = this.getAllApptSlots();
    this.appts = apptSlots.filter((val) => !unavailableSlots.includes(val));
  }

  updateAvailableAppts() {
    this.blockBookedAppointments();
  }

  blockBookedAppointments() {
    const dformat = 'DD/MM/YYYY';
    const tformat = 'HH:mm';
    let appointments: string[] = [];

    this.apptService.getAppointments().subscribe({
      next: (appts) =>
        appts.map((appt) => {
          const apptDate = moment(appt.appointmentDate, dformat);
          const selectedDate = moment(this.selected_apptDate, dformat);
          const apptTime = moment(appt.appointmentTime);

          // select hairstylist
          if (appt.name === this.selected_hairstylist) {
            // if selected date is the same day and keep looping to check
            if (selectedDate.isSame(apptDate, 'day')) {
              appointments.push(apptTime.format(tformat));
            }
          }
          this.addToBlockedSlots(appointments);
          this.blockOverlapLeave();
        }),
    });
  }

  formatDate(date: Date) {
    return moment(date, 'DD/MM/YYYY');
  }

  blockOverlapLeave() {
    let leavesArray: string[] = [];

    this.leaveService.getLeaves().subscribe({
      next: (leaves: Leave[]) => {
        console.log(leaves);
        leaves.forEach((leave) => {
          const startDate = this.formatDate(leave.startDate);
          const endDate = this.formatDate(leave.endDate);
          const selectedDate = this.formatDate(this.selected_apptDate);

          const hairstylist = this.getHairStylistById(leave.userId);
          // check if user is on leave today

          const onLeave = selectedDate.isBetween(
            startDate,
            endDate,
            null,
            '[]'
          );

          if (hairstylist === this.selected_hairstylist && onLeave) {
            leavesArray = this.getSlotsBetweenTimeInterval(
              leave.startTime,
              leave.endTime
            );
          }

          this.addToBlockedSlots(leavesArray);
          this.removeUnavailableSlots(this.blockedSlots);
        });
      },
    });
  }

  getHairStylistById(id: number) {
    const user = this.users.filter((u) => u.userId === id);
    if (user && user[0]) {
      return user[0].name;
    }
    return '';
  }

  getHairStylistIdByName(name: string) {
    const user = this.users.filter((u) => u.name === name);
    if (user && user[0]) {
      return user[0].userId;
    }
    return 0;
  }

  get name() {
    return this.contactForm.controls.name;
  }

  get email() {
    return this.contactForm.controls.email;
  }

  get mobile() {
    return this.contactForm.controls.mobile;
  }

  submit() {
    this.createCustomer();
  }

  createAppointment() {
    const appt: RegisterAppt = new RegisterAppt();
    appt.userId = this.getHairStylistIdByName(this.selected_hairstylist) || 0;
    appt.appointmentDate = this.selected_apptDate || new Date();
    appt.appointmentTime = this.selected_appt || '';
    appt.customerId = this.customerId;
    console.log(appt.customerId);

    this.apptService.createAppointment(appt).subscribe(
      (_) => {
        this.success = true;
      },
      (error) => console.log(error)
    );
  }

  createCustomer() {
    let mobile: string = this.mobile.value.e164Number;
    mobile = mobile.replace(/[^\w\s]/gi, '');
    const phone = +mobile;

    const c = new RegisterCustomer();
    c.customerName = this.name.value || '';
    c.phoneNumber = phone || 0;
    c.password = '';
    c.username = c.customerName;

    this.customerService.createCustomer(c).subscribe(
      (_) => {
        this.success = true;
        this.setCustomerId();
      },
      (error) => console.log(error)
    );
  }

  setCustomerId() {
    const customerName = this.name.value || '';
    this.customerService.getCustomers().subscribe({
      next: (customers) => {
        const customer = customers.filter(
          (c) => c.customerName === customerName
        );
        if (customer && customer[0]) {
          this.customerId = customer[0].customerId;
          this.createAppointment();
        }
      },
    });
  }

  signOut(): void {
    this.authService.signOut();
    this.router.navigate(['home/login']);
    sessionStorage.clear();
  }
}
