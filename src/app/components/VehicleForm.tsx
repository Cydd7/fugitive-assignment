"use client";
import { useForm } from "react-hook-form";
import { ICity, ICop, ISelection, IVehicle } from "@/lib/types";
import { updateSelections } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createVehicleFormSchema } from "@/lib/schema";

export function VehicleForm({ sessionId, cops, selections, vehicles }: { sessionId: string, cities: ICity[], cops: ICop[], selections: ISelection[], vehicles: IVehicle[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createVehicleFormSchema(cops, vehicles)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection?.vehicleId?.toString() ?? "";
        return acc;
      }, {}),
    },
  });

  const handleVehicleSelection = async (data: Record<string, string>) => {
    let selectionsPayload = [];
    selectionsPayload = selections.map((selection) => ({
      ...selection,
      vehicleId: parseInt(data[`cop-${selection.copId}`]),
    }));
    await updateSelections(selectionsPayload, 'vehicle-selection');

    router.push(`/result/${sessionId}`);
  }

  return (
    <div>
      <form onSubmit={handleSubmit(handleVehicleSelection)}>
        {cops.map((cop: ICop) => {
          return (
            <div key={cop.id}>
              {cop.name}
              <select {...register(`cop-${cop.id}`)}>
                <option value="">Select a vehicle</option>
                {vehicles.map((vehicle: IVehicle) => {
                  return (
                    <option key={vehicle.id} value={vehicle.id}>
                      {vehicle.kind} ({vehicle.range}km)
                    </option>
                  );
                })}
              </select>
            </div>
          );
        })}
        {/* Display the refined error */}
        {errors.form && <p>{errors.form.message?.toString()}</p>}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}