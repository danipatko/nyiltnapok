import { PrismaClient } from '@prisma/client';

// TODO? not tested: may create way too many clients in dev mode
const prisma = new PrismaClient();
prisma.$connect();

export default prisma;
