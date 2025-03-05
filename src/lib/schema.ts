import { z } from "zod";

export const CitySchema = z.object({
  gameSessionId: z.string(),
  copNumber: z.number().min(1).max(3),
  cityId: z.number(),
});

export const VehicleSchema = z.object({
  gameSessionId: z.string(),
  copNumber: z.number().min(1).max(3),
  vehicleId: z.number(),
});