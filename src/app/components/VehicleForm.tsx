"use client";
import { useParams, useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ICop, ISelection, IVehicle } from "@/lib/types";
import { createVehicleFormSchema } from "@/lib/schema";
import { handleVehicleSelection } from "@/lib/utils";
import { useForm } from "react-hook-form";
import { Error } from "./Error";
import { ImageDisplay } from "./ImageDisplay";

export function VehicleForm({ cops, selections, vehicles }: { cops: ICop[], selections: ISelection[], vehicles: IVehicle[] }) {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(createVehicleFormSchema(cops, vehicles)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection?.vehicleId?.toString() ?? "";
        return acc;
      }, {}),
    },
  });

  // Watch for changes in the form values
  const formValues = watch();

  async function handleVehicleFormSubmit(data: Record<string, string>) {
    await handleVehicleSelection(data, selections);
    router.push(`/result/${sessionId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
      <div className="text-center max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4">Select Vehicles for Cops</h1>
        <form onSubmit={handleSubmit(handleVehicleFormSubmit)} className="space-y-8">
          {cops.map((cop: ICop) => {
            const copId = `cop-${cop.id}`;
            const selectedVehicle = vehicles.find(vehicle => vehicle.id === parseInt(formValues[copId]));
            console.log("selectedVehicle", selectedVehicle);

            return (
              <div key={cop.id} className="flex flex-col md:flex-row items-center gap-4 p-4 bg-white/80 rounded-lg shadow min-h-[160px]">

                <div className="flex flex-col items-center w-32">
                  <ImageDisplay
                    src={`/images/${copId}.png`}
                    alt={cop.name}
                    className="mb-2"
                  />
                  <span className="font-semibold text-center">{cop.name}</span>
                </div>

                <div className="flex-1">
                  <label hidden>{cop.name}</label>
                  <select
                    {...register(copId)}
                    className="p-2 rounded-lg bg-white text-black mb-2 w-full"
                  >
                    <option value="">Select a vehicle</option>
                    {vehicles.map((vehicle: IVehicle) => {
                      return (
                        <option key={vehicle.id} value={vehicle.id}>
                          {vehicle.kind} ({vehicle.range}km)
                        </option>
                      );
                    })}
                  </select>
                  {errors[copId] && <Error error={errors[copId]?.message?.toString() || ''} />}
                </div>

                {selectedVehicle && (
                  <div className="flex flex-col items-center w-32">
                    <ImageDisplay
                      src={`/images/${selectedVehicle.kind.toLowerCase()}.png`}
                      alt={selectedVehicle.kind}
                      className="mb-2"
                    />
                    <span className="font-semibold text-center">{selectedVehicle.kind}</span>
                  </div>
                )}

              </div>
            );
          })}

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