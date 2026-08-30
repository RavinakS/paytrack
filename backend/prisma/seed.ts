import 'dotenv/config';
import { CisStatus, PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const workers: Array<{ name: string; cisStatus: CisStatus }> = [
    { name: 'Asha Patel', cisStatus: 'NET_VERIFIED' },
    { name: 'Ben Carter', cisStatus: 'GROSS' },
    { name: 'Chloe Smith', cisStatus: 'UNMATCHED' },
  ];

  for (const worker of workers) {
    await prisma.worker.upsert({
      where: { name: worker.name },
      update: { cisStatus: worker.cisStatus },
      create: worker,
    });
  }
}

main().finally(() => prisma.$disconnect());
