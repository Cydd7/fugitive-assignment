import { Suspense } from "react";
import { getCitiesAndCops, getSelections } from "@/lib/actions";
import { CityForm } from "@/app/components/CityForm";
import { Loading } from "@/app/components/Loading";

export default async function CitySelectionPage({ params }: { params: { sessionId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <CityFormWrapper sessionId={params.sessionId} />
    </Suspense>
  );
}

async function CityFormWrapper({ sessionId }: { sessionId: string }) {
  const { cities, cops } = await getCitiesAndCops();
  const selections = await getSelections(sessionId);

  return (
    <div>
      <CityForm cities={cities} cops={cops} selections={selections} />
    </div>
  );
}