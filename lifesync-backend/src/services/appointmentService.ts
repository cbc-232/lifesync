import { PrismaClient, AppointmentStatus } from '@prisma/client';
const prisma = new PrismaClient();


export interface AppointmentInput {
  district: string;
  address: string;

  guestName?: string;
  guestPhone?: string;
  guestEmail?: string;

  patientId?: number; 

  hospitalId: number;
  type: 'Booking' | 'Emergency' | 'Inquiry';
  date: string;
  time: string;
  reason?: string;
}

const validDistricts = [
  "Western Area Urban", "Western Area Rural", "Bombali", "Kambia",
  "Koinadugu", "Port Loko", "Tonkolili", "Bo", "Bonthe", "Kono",
  "Kenema", "Pujehun", "Moyamba", "Kailahun", "Falaba", "Karene"
];

function isValidDistrict(district: string): boolean {
  return validDistricts.includes(district);
}

export async function createAppointment(data: AppointmentInput) {
  // Required fields
  if (!data.hospitalId || !data.type || !data.date || !data.time) {
    throw new Error('hospitalId, type, date, and time are required.');
  }

  // District & address
  if (!isValidDistrict(data.district)) {
    throw new Error('Invalid district selected.');
  }
  if (!data.address.trim()) {
    throw new Error('Address is required.');
  }
  const location = `${data.district}, ${data.address}`;

  // Build payload
  const payload: any = {
    hospital: { connect: { id: data.hospitalId } },
    type: data.type,
    date: data.date,
    time: data.time,
    reason: data.reason,
    location,
  };

  if (data.patientId) {
    // Authenticated user
    payload.patient = { connect: { id: data.patientId } };
  } else {
    // Guest
    if (!data.guestName || !data.guestPhone) {
      throw new Error('guestName and guestPhone are required for guest bookings.');
    }
    payload.guestName = data.guestName;
    payload.guestPhone = data.guestPhone;
    payload.guestEmail = data.guestEmail;
  }

  return prisma.appointment.create({ data: payload });
}

export async function listAppointments() {
  return prisma.appointment.findMany({
    include: { patient: true, hospital: true }
  });
}

// Fetch a single appointment by its ID
export async function getAppointmentById(id: number) {
  const appt = await prisma.appointment.findUnique({
    where: { id },
    include: { patient: true, hospital: true }
  });
  if (!appt) throw new Error('Appointment not found');
  return appt;
}

// Update only the status field of an appointment
export async function updateAppointmentStatus(id: number, status: string) {
  // Define exactly the enum values from Prisma
  const allowed: AppointmentStatus[] = [
    AppointmentStatus.PENDING,
    AppointmentStatus.CONFIRMED,
    AppointmentStatus.CANCELLED,
    AppointmentStatus.COMPLETED
  ];

  // Normalize incoming string into uppercase enum form
  const upper = status.toUpperCase() as AppointmentStatus;
  if (!allowed.includes(upper)) {
    throw new Error(`Status must be one of: ${allowed.join(', ')}`);
  }

  return prisma.appointment.update({
    where: { id },
    data: {
      status: { set: upper }  // ← Use the "set" syntax with the enum
    }
  });
}


// Delete an appointment permanently
export async function deleteAppointment(id: number) {
  return prisma.appointment.delete({ where: { id } });
}
