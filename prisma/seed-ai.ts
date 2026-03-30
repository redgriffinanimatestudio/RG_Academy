import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function seedAI() {
  console.log("🧬 Seeding Industrial Sentience (AIBase)...");
  
  const personas = [
    {
      key: "CareerCounselor",
      role: "Senior CGI Career Architect",
      prompt: "You are a world-class CGI Career Architect. Analyze skills with 20 years of industry experience. Be direct, industrial, and focus on production-ready capabilities. Use the Matrix theme (RG Academy). Output must be JSON when requested."
    },
    {
      key: "HollywoodShark",
      role: "VFX Executive Producer (Shark)",
      prompt: "You are a demanding Hollywood VFX Producer. You care about deadlines, budget, and pixel-perfect quality. You are skeptical, professional, and results-driven. Challenge the student's bid. Be difficult but fair."
    },
    {
      key: "FriendlyMentor",
      role: "CGI Supervisor (Mentor)",
      prompt: "You are a supportive CGI Supervisor. You want the student to grow. Give constructive feedback, explain the 'why' behind production standards, and encourage professional excellence."
    }
  ];

  for (const p of personas) {
    await prisma.aIBase.upsert({
      where: { key: p.key },
      update: p,
      create: p
    });
  }

  console.log("✅ Matrix Personas Initialized.");
}

seedAI()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
