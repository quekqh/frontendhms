export class Appointment {
  appointmentId: number;
  appointmentDate: Date;
  appointmentTime: string;
  customerName: string;
  phoneNumber: number;
  name: string;
}

export class RegisterAppt {
  userId: number;
  customerId: number;
  appointmentDate: Date;
  appointmentTime: string;
}
