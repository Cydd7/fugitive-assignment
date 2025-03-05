import { CityForm } from "@/components/CityForm";

export default function CitySelectionPage({ params }: { params: { sessionId: string } }) {
  return (
    <div>
      <h1>Select City</h1>
      <CityForm sessionId={params.sessionId} copNumber={1} />
      <CityForm sessionId={params.sessionId} copNumber={2} />
      <CityForm sessionId={params.sessionId} copNumber={3} />
    </div>
  );
}