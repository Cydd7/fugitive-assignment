import { getCitiesAndCops, getSelections } from "@/lib/actions";
import { CityForm } from "@/app/components/CityForm";

export default async function CitySelectionPage({ params }: { params: { sessionId: string } }) {

  const { cities, cops } = await getCitiesAndCops();
  const selections = await getSelections(params.sessionId);

  console.log("server", cities, cops, selections);

  return (
    <div>
      <CityForm sessionId={params.sessionId} cities={cities} cops={cops} selections={selections} />
    </div>
  );
}