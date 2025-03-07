import { getCitiesAndCops, getSelections, getVehicles } from "@/lib/actions";
import { VehicleForm } from "@/app/components/VehicleForm";

export default async function VehicleSelectionPage({ params }: { params: { sessionId: string } }) {
  const { cops } = await getCitiesAndCops();
  const selections = await getSelections(params.sessionId);
  const vehicles = await getVehicles();

  return (
    <div>
      <VehicleForm cops={cops} selections={selections} vehicles={vehicles} />
    </div>
  );
}