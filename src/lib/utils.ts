import { createSelections, updateSelections } from "./actions";
import { prisma } from "@/lib/db";
import { ISelection, IGameSession, IVehicle, ICity, ICop } from "@/lib/types";

export const handleCitySelection = async (data: Record<string, string>, sessionId: string, selections: ISelection[]) => {
    let selectionsPayload = [];

    if (selections.length > 0) {
        selectionsPayload = selections.map((selection) => ({
            ...selection,
            cityId: parseInt(data[`cop-${selection.copId}`]),
        }));
        await updateSelections(selectionsPayload, 'city-selection');
    }
    else {
        selectionsPayload = Object.entries(data).map(([key, value]) => ({
            gameSessionId: sessionId,
            copId: parseInt(key.split('-')[1]),
            cityId: parseInt(value),
        }));
        await createSelections(selectionsPayload);
    }
}

export const handleVehicleSelection = async (data: Record<string, string>, sessionId: string, selections: ISelection[]) => {
    const selectionsPayload = selections.map((selection) => ({
        ...selection,
        vehicleId: parseInt(data[`cop-${selection.copId}`]),
    }));
    await updateSelections(selectionsPayload, 'vehicle-selection');
}

export async function determineWinningCop(selections: ISelection[], gameSession: IGameSession, vehicles: IVehicle[], cities: ICity[], cops: ICop[]) {
    const { fugitiveCityId } = gameSession;

    // Check if the fugitive city is in the selections
    const fugitiveCitySelection = selections.find(selection => selection.cityId === fugitiveCityId);
    if (!fugitiveCitySelection) return null; // Cops did not select the fugitive city

    // Get the vehicle and city from db
    const vehicle = await prisma.vehicle.findUnique({
        where: { id: fugitiveCitySelection.vehicleId ?? undefined },
    });
    const city = await prisma.city.findUnique({
        where: { id: fugitiveCitySelection.cityId ?? undefined },
    });

    // Ensure vehicle and city are defined and have valid values
    if (vehicle && city && vehicle.range !== null && city.distance !== null) {
        if (vehicle.range >= city.distance * 2) {
            return cops.find(c => c.id === fugitiveCitySelection.copId); // Return the cop if they have enough range
        }
    }

    // No cop found the fugitive
    return null;
}