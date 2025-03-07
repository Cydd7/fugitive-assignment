import { z } from "zod";
import { ICop, IVehicle } from "./types";

// Schema for creating city form
export const createCityFormSchema = (cops: ICop[]) =>
  z.object({
    ...cops.reduce((acc: Record<string, z.ZodSchema>, cop) => {
      acc[`cop-${cop.id}`] = z.string().min(1, { message: "Every cop must be assigned to a city" });
      return acc;
    }, {}),
  }).refine((data) => {
    const cityIds = Object.values(data).map((value) => parseInt(value));
    const uniqueCityIds = new Set(cityIds);
    return uniqueCityIds.size === cityIds.length;
  }, {
    message: "Every cop must be assigned to a different city",
    path: ["form"],
  });

// Schema for creating vehicle form
export const createVehicleFormSchema = (cops: ICop[], vehicles: IVehicle[]) =>
  z.object({
    ...cops.reduce((acc: Record<string, z.ZodSchema>, cop) => {
      acc[`cop-${cop.id}`] = z.string().min(1, { message: "Every cop must be assigned to a vehicle" });
      return acc;
    }, {}),
  }).refine((data) => {
    const vehicleCounts = vehicles.map(({ id, max_count }) => ({ id, count: max_count }));

    cops.forEach((cop) => {
      const vehicleId = parseInt(data[`cop-${cop.id}`]);
      const vehicleCount = vehicleCounts.find((v) => v.id === vehicleId);
      if (vehicleCount) {
        vehicleCount.count--;
      }
    });

    return vehicleCounts.every((v) => v.count >= 0);
  }, {
    message: "There are only 2 EV bikes, 1 EV car and 1 EV SUV available",
    path: ["form"],
  });

// Schema for City
export const CitySchema = z.object({
  id: z.number(),
  name: z.string(),
  distance: z.number(),
});

// Schema for Vehicle
export const VehicleSchema = z.object({
  id: z.number(),
  kind: z.string(),
  range: z.number(),
  max_count: z.number(),
});

// Schema for Cops
export const CopsSchema = z.object({
  id: z.number(),
  name: z.string(),
  image: z.string(),
});

// Schema for Game Session
export const GameSessionSchema = z.object({
  id: z.string().uuid(),
  fugitiveCityId: z.number(),
  createdAt: z.date(),
});

// Schema for Selection
export const SelectionSchema = z.object({
  id: z.string().uuid(),
  copId: z.number(),
  cityId: z.number(),
  vehicleId: z.number().optional().nullable(),
  gameSessionId: z.string().uuid(),
});