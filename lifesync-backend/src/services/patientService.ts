import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export interface CreatePatientInput {
  userId?: number; // optional for now – will only be used for authenticated users
  name: string;
  phone: string;
  email?: string;
  location?: string;  // This includes the district and address
}

// Define the valid districts in Sierra Leone
const validDistricts = [
  "Western Area Urban", "Western Area Rural", "Bombali", "Kambia", "Koinadugu", "Port Loko",
  "Tonkolili", "Bo", "Bonthe", "Kono", "Kenema", "Pujehun", "Moyamba", "Kailahun", "Falaba",
  "Karene"
];

// Helper function to validate the district
function isValidDistrict(district: string): boolean {
  return validDistricts.includes(district);
}

// CREATE
export async function createPatient(data: CreatePatientInput) {
  const locationParts = data.location?.split(',') || [];
  const district = locationParts[0]?.trim();
  const address = locationParts[1]?.trim();

  if (!district || !address) {
    throw new Error('Both district and address are required.');
  }

  if (!isValidDistrict(district)) {
    throw new Error('Invalid district selected.');
  }

  const createData: any = {
    name: data.name,
    phone: data.phone,
    email: data.email,
    location: data.location,
  };

  if (data.userId) {
    createData.user = { connect: { id: data.userId } };
  }

  return prisma.patient.create({ data: createData });
}

// READ ALL
export async function findAllPatients() {
  return prisma.patient.findMany();
}

// READ ONE
export async function findPatientById(id: string) {
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    throw new Error('Invalid patient ID');
  }

  return prisma.patient.findUnique({
    where: { id: patientId },
  });
}

// READ ONE BY PHONE
export async function findPatientByPhone(phone: string) {
  return prisma.patient.findFirst({
    where: { phone: phone },
  });
}

// UPDATE
export async function updatePatient(id: string, updateData: Partial<CreatePatientInput>) {
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    throw new Error('Invalid patient ID');
  }

  return prisma.patient.update({
    where: { id: patientId },
    data: updateData,
  });
}

// DELETE
export async function deletePatient(id: string) {
  const patientId = parseInt(id);
  if (isNaN(patientId)) {
    throw new Error('Invalid patient ID');
  }

  return prisma.patient.delete({
    where: { id: patientId },
  });
}
