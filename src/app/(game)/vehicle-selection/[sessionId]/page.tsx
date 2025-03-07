import { Suspense } from "react";
import { getCitiesAndCops, getSelections, getVehicles } from "@/lib/actions";
import { VehicleForm } from "@/app/components/VehicleForm";
import { Loading } from "@/app/components/Loading";

export default async function VehicleSelectionPage({ params }: { params: { sessionId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <VehicleFormWrapper sessionId={params.sessionId} />
    </Suspense>
  );
}

async function VehicleFormWrapper({ sessionId }: { sessionId: string }) {
  const { cops } = await getCitiesAndCops();
  const selections = await getSelections(sessionId);
  const vehicles = await getVehicles();

  return (
    <div>
      <VehicleForm cops={cops} selections={selections} vehicles={vehicles} />
    </div>
  );
}