"use server";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { CitySchema, CopsSchema, GameSessionSchema, SelectionSchema, VehicleSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { ISelection } from "./types";

export async function createGameSession() {
  try {
    const cities = await prisma.city.findMany();
    const fugitiveCity = cities[Math.floor(Math.random() * cities.length)];
    const gameSession = await prisma.gameSession.create({
      data: { fugitiveCityId: fugitiveCity.id },
    });
    // Validate the game session
    const validatedGameSession = GameSessionSchema.parse(gameSession);
    return validatedGameSession.id;
  } catch (error) {
    console.error("Error creating game session:", error);
    throw new Error("Failed to create game session");
  }
}

export async function handleStartClick() {
  const gameId = await createGameSession();
  redirect(`/city-selection/${gameId}`);
};

export async function getCitiesAndCops() {
  try {
    const cities = await prisma.city.findMany();
    const cops = await prisma.cops.findMany();
    // Validate Cities and Cops
    const validatedCities = CitySchema.array().parse(cities);
    const validatedCops = CopsSchema.array().parse(cops);
    return { cities: validatedCities, cops: validatedCops };
  } catch (error) {
    console.error("Error getting cities and cops:", error);
    throw new Error("Failed to get cities and cops");
  }
}

export async function getVehicles() {
  try {
    const vehicles = await prisma.vehicle.findMany();
    // Validate Vehicles
    const validatedVehicles = VehicleSchema.array().parse(vehicles);
    return validatedVehicles;
  } catch (error) {
    console.error("Error getting vehicles:", error);
    throw new Error("Failed to get vehicles");
  }
}

export async function getGameSession(gameSessionId: string) {
  try {
    const gameSession = await prisma.gameSession.findUnique({
      where: { id: gameSessionId },
    });
    // Validate the game session
    const validatedGameSession = GameSessionSchema.parse(gameSession);
    return validatedGameSession;
  } catch (error) {
    console.error("Error getting game session:", error);
    throw new Error("Failed to get game session");
  }
}

export async function getSelections(gameSessionId: string) {
  try {
    const selections = await prisma.selection.findMany({
      where: { gameSessionId },
      include: { city: true, vehicle: true },
    });
    // Validate the selections
    console.log("selections", selections)
    const validatedSelections = SelectionSchema.array().parse(selections);
    return validatedSelections;
  } catch (error) {
    console.error("Error getting selections:", error);
    throw new Error("Failed to get selections");
  }
}

export async function updateSelections(selections: ISelection[], path: string) {
  try {
    // Check if selections already exist for the given gameSessionId
    const existingSelections = await prisma.selection.findMany({
      where: { gameSessionId: selections[0].gameSessionId },
    });

    if (existingSelections.length > 0) {
      // Update existing selections
      const createdSelections = await Promise.all(
        existingSelections.map(async (existingSelection) => {
          const selectionToUpdate = selections.find(selection => { console.log("here", selection.id, existingSelection.id); return selection.id === existingSelection.id });
          console.log("selectionToUpdate", selectionToUpdate, existingSelection)
          if (selectionToUpdate) { // Ensure selectionToUpdate is defined
            const updatedSelection = await prisma.selection.update({
              where: { id: existingSelection.id },
              data: selectionToUpdate, // Use the found selection
            });
            return updatedSelection;
          }
          return existingSelection; // Return the existing selection if no update is needed
        })
      );
      console.log("createdSelections", createdSelections)
      SelectionSchema.array().parse(createdSelections);
    }

    if (path === 'city-selection') {
      revalidatePath(`/city-selection/${selections[0]?.gameSessionId}`);
    }
    else if (path === 'vehicle-selection') {
      revalidatePath(`/vehicle-selection/${selections[0]?.gameSessionId}`);
    }
  } catch (error) {
    console.error("Error updating selections:", error);
    throw new Error("Failed to update selections");
  }
}

export async function createSelections(selections: ISelection[]) {
  try {
    await prisma.selection.createMany({
      data: selections,
    });
    revalidatePath(`/city-selection/${selections[0]?.gameSessionId}`);
  } catch (error) {
    console.error("Error creating selections:", error);
    throw new Error("Failed to create selections");
  }
}