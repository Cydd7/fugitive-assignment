import { getCitiesAndCops, getSelections } from "@/lib/actions";
import { CityForm } from "@/app/components/CityForm";

export default async function CitySelectionPage({ params }: { params: { sessionId: string } }) {

  const { cities, cops } = await getCitiesAndCops();
  const selections = await getSelections(params.sessionId);

  return (
    <div>
      <CityForm cities={cities} cops={cops} selections={selections} />
    </div>
  );
}