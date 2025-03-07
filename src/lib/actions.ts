"use server";
import { redirect } from "next/navigation";
import { prisma } from "./db";
import { CitySchema, CopsSchema, GameSessionSchema, SelectionSchema } from "./schema";
import { revalidatePath } from "next/cache";
import { ISelection } from "./types";

//! TODO: Add try catch to all actions

export async function createGameSession() {
  const cities = await prisma.city.findMany();
  const fugitiveCity = cities[Math.floor(Math.random() * cities.length)];
  const gameSession = await prisma.gameSession.create({
    data: { fugitiveCityId: fugitiveCity.id },
  });

  const validatedGameSession = GameSessionSchema.parse(gameSession);
  return validatedGameSession.id;
}

export async function handleStartClick() {
  const gameId = await createGameSession();
  redirect(`/city-selection/${gameId}`);
};

export async function getCitiesAndCops() {
  const cities = await prisma.city.findMany();
  const cops = await prisma.cops.findMany();

  // Validate data against schemas
  const validatedCities = CitySchema.array().parse(cities);
  const validatedCops = CopsSchema.array().parse(cops);

  return { cities: validatedCities, cops: validatedCops };
}

export async function getVehicles() {
  const vehicles = await prisma.vehicle.findMany();
  return vehicles;
}

export async function getGameSession(gameSessionId: string) {
  const gameSession = await prisma.gameSession.findUnique({
    where: { id: gameSessionId },
  });
  return gameSession;
}

export async function getSelections(gameSessionId: string) {
  const selections = await prisma.selection.findMany({
    where: { gameSessionId },
    include: { city: true, vehicle: true },
  });

  const validatedSelections = SelectionSchema.array().parse(selections);

  return validatedSelections;
}

export async function updateSelections(selections: ISelection[], path: string) {
  console.log("Updating selections with:", selections); // Log the selections

  // Check if selections already exist for the given gameSessionId
  const existingSelections = await prisma.selection.findMany({
    where: { gameSessionId: selections[0].gameSessionId },
  });

  console.log("existingSelections", existingSelections)

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
  }

  if (path === 'city-selection') {
    revalidatePath(`/city-selection/${selections[0]?.gameSessionId}`);
  }
  else if (path === 'vehicle-selection') {
    revalidatePath(`/vehicle-selection/${selections[0]?.gameSessionId}`);
  }
}

export async function createSelections(selections: ISelection[]) {
  console.log("Creating selections with:", selections); // Log the selections

  const createdSelections = await prisma.selection.createMany({
    data: selections,
  });

  console.log("createdSelections", createdSelections)

  revalidatePath(`/city-selection/${selections[0]?.gameSessionId}`);

  return createdSelections;
}