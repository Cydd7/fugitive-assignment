"use client";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICop, ISelection, IVehicle } from "@/lib/types";
import { createVehicleFormSchema } from "@/lib/schema";
import { handleVehicleSelection } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Error } from "./Error";

export function VehicleForm({ cops, selections, vehicles }: { cops: ICop[], selections: ISelection[], vehicles: IVehicle[] }) {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createVehicleFormSchema(cops, vehicles)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection?.vehicleId?.toString() ?? "";
        return acc;
      }, {}),
    },
  });

  async function handleVehicleFormSubmit(data: Record<string, string>) {
    await handleVehicleSelection(data, selections);
    router.push(`/result/${sessionId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Select Vehicles for Cops</h1>
        <form onSubmit={handleSubmit(handleVehicleFormSubmit)} className="space-y-4">
          {cops.map((cop: ICop) => {
            return (
              <div key={cop.id} className="flex flex-col">
                <label className="text-lg mb-1">{cop.name}</label>
                <select {...register(`cop-${cop.id}`)} className="p-2 rounded-lg bg-white text-black mb-[10px]">
                  <option value="">Select a vehicle</option>
                  {vehicles.map((vehicle: IVehicle) => {
                    return (
                      <option key={vehicle.id} value={vehicle.id}>
                        {vehicle.kind} ({vehicle.range}km)
                      </option>
                    );
                  })}
                </select>
                {errors[`cop-${cop.id}`] && <Error error={errors[`cop-${cop.id}`]?.message?.toString() || ''} />}
              </div>
            );
          })}

          {/* Display the refined error */}
          {errors.form && <Error error={errors.form.message?.toString() || ''} />}

          <button
            disabled={isSubmitting}
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition duration-300 disabled:opacity-50"
          >
            {isSubmitting ? 'Submitting...' : 'Submit'}
          </button>
        </form>
      </div>
    </main>
  );
}