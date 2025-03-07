import { getCitiesAndCops, getGameSession, getSelections, getVehicles } from "@/lib/actions";
import { prisma } from "@/lib/db";
import { ISelection, IGameSession, IVehicle, ICity, ICop } from "@/lib/types";

async function determineWinningCop(selections: ISelection[], gameSession: IGameSession, vehicles: IVehicle[], cities: ICity[], cops: ICop[]) {
  console.log(vehicles, cities, cops)

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

  return null; // No cop found the fugitive
}

export default async function ResultPage({ params }: { params: { sessionId: string } }) {
  const { cities, cops } = await getCitiesAndCops();
  const selections = await getSelections(params.sessionId);
  const vehicles = await getVehicles();

  // Get GameSession
  const gameSession = await getGameSession(params.sessionId);

  if (!gameSession) {
    return <div>Game session not found</div>; // Handle the case where the game session does not exist
  }


  if (!params.sessionId) return <div>Game not found</div>;

  // Logic to determine the winning cop
  const winningCop = await determineWinningCop(selections, gameSession, vehicles, cities, cops);

  return (
    <div>
      <h1>Result</h1>
      {winningCop ? (
        <p>Cop {winningCop?.name} captured the fugitive!</p>
      ) : (
        <p>The fugitive escaped!</p>
      )}
    </div>
  );
}