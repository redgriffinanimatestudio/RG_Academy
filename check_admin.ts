import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.findUnique({ 
    where: { email: 'admin@redgriffin.academy' } 
  });
  if (admin) {
    console.log("✅ Admin exists:", JSON.stringify(admin, null, 2));
  } else {
    console.log("❌ Admin NOT found in DB");
  }
}

main().catch(console.error).finally(() => prisma.$disconnect());
