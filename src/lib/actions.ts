"use server";
import { prisma } from "./db";
import { z } from "zod";
import { CitySchema, VehicleSchema } from "./schema";

export async function createGameSession() {
  const cities = await prisma.city.findMany();
  const fugitiveCity = cities[Math.floor(Math.random() * cities.length)];
  const gameSession = await prisma.gameSession.create({
    data: { fugitiveCityId: fugitiveCity.id },
  });
  return gameSession.id;
}

export async function selectCity(data: FormData) {
  const parsed = CitySchema.parse({
    gameSessionId: data.get("gameSessionId"),
    copNumber: parseInt(data.get("copNumber") as string),
    cityId: parseInt(data.get("cityId") as string),
  });

  const existing = await prisma.selection.findFirst({
    where: {
      gameSessionId: parsed.gameSessionId,
      OR: [{ copNumber: parsed.copNumber }, { cityId: parsed.cityId }],
    },
  });

  if (existing) throw new Error("Invalid selection");

  await prisma.selection.create({
    data: {
      gameSessionId: parsed.gameSessionId,
      copNumber: parsed.copNumber,
      cityId: parsed.cityId,
    },
  });
}

export async function selectVehicle(data: FormData) {
  const parsed = VehicleSchema.parse({
    gameSessionId: data.get("gameSessionId"),
    copNumber: parseInt(data.get("copNumber") as string),
    vehicleId: parseInt(data.get("vehicleId") as string),
  });

  const existing = await prisma.selection.findFirst({
    where: {
      gameSessionId: parsed.gameSessionId,
      copNumber: parsed.copNumber,
    },
  });

  if (!existing) throw new Error("City not selected");

  await prisma.selection.update({
    where: { id: existing.id },
    data: { vehicleId: parsed.vehicleId },
  });
}