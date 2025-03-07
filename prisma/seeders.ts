import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {

  // Clear the database
  await prisma.selection.deleteMany();
  await prisma.gameSession.deleteMany();
  await prisma.city.deleteMany();
  await prisma.cops.deleteMany();
  await prisma.vehicle.deleteMany();

  await prisma.city.createMany({
    data: [
      { name: "Yapkashnagar", distance: 60 },
      { name: "Lihaspur", distance: 50 },
      { name: "Narmis City", distance: 40 },
      { name: "Shekharvati", distance: 30 },
      { name: "Nuravgram", distance: 20 },
    ],
  });

  await prisma.cops.createMany({
    data: [
      { name: "Cop 1", image: "" },
      { name: "Cop 2", image: "" },
      { name: "Cop 3", image: "" },
    ],
  });

  await prisma.vehicle.createMany({
    data: [
      { kind: "EV Bike", range: 60, max_count: 2 },
      { kind: "EV Car", range: 100, max_count: 1 },
      { kind: "EV SUV", range: 120, max_count: 1 },
    ],
  });
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });