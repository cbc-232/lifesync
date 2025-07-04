import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

interface CreateInquiryInput {
  name: string;
  email: string;
  message: string;
  location: string;
}

export async function createInquiry(data: CreateInquiryInput) {
  return prisma.inquiry.create({
    data: {
      name: data.name,
      email: data.email,
      message: data.message,
      location: data.location,
    },
  });
}

export async function getAllInquiries() {
  return prisma.inquiry.findMany({
    orderBy: {
      createdAt: 'desc',
    },
  });
}
