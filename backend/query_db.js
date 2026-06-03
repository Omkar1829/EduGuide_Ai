const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  try {
    const count = await prisma.job.count();
    console.log('Total jobs count in database:', count);
    const jobs = await prisma.job.findMany({ take: 5 });
    console.log('Sample jobs:', JSON.stringify(jobs, null, 2));
  } catch (err) {
    console.error('Error querying database:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
