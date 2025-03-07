import { getCitiesAndCops, getSelections, getVehicles } from "@/lib/actions";
import { VehicleForm } from "@/app/components/VehicleForm";

export default async function VehicleSelectionPage({ params }: { params: { sessionId: string } }) {

  const { cities, cops } = await getCitiesAndCops();
  const selections = await getSelections(params.sessionId);
  const vehicles = await getVehicles();

  console.log("server", cities, cops, selections);

  return (
    <div>
      <VehicleForm sessionId={params.sessionId} cities={cities} cops={cops} selections={selections} vehicles={vehicles} />
    </div>
  );
}