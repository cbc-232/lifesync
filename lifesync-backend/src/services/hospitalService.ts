import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

// Input for creating/updating a hospital
export interface HospitalInput {
  name: string;
  location: string;
}

export async function listHospitals(filter?: { name?: string; location?: string }) {
  const where: any = {};
  if (filter?.name) where.name = { contains: filter.name, mode: 'insensitive' };
  if (filter?.location) where.location = { contains: filter.location, mode: 'insensitive' };
  return prisma.hospital.findMany({ where });
}

export async function getHospitalById(id: number) {
  const hospital = await prisma.hospital.findUnique({
    where: { id },
    include: { appointments: true, staff: true }
  });
  if (!hospital) throw new Error('Hospital not found');
  return hospital;
}

export async function createHospital(data: HospitalInput) {
  return prisma.hospital.create({ data });
}

export async function updateHospital(id: number, data: HospitalInput) {
  // throws if not found
  await getHospitalById(id);
  return prisma.hospital.update({
    where: { id },
    data
  });
}

export async function deleteHospital(id: number) {
  // throws if not found
  await getHospitalById(id);
  return prisma.hospital.delete({ where: { id } });
}
