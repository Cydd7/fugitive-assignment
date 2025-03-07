"use client";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ICity, ICop, ISelection } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCityFormSchema } from "@/lib/schema";
import { Error } from "./Error";
import { handleCitySelection } from "@/lib/utils";

export function CityForm({ sessionId, cities, cops, selections }: { sessionId: string, cities: ICity[], cops: ICop[], selections: ISelection[] }) {

  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(createCityFormSchema(cops)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection.cityId.toString();
        return acc;
      }, {}),
    },
  });

  console.log(sessionId, cities, cops, selections);

  async function handleCityFormSubmit(data: Record<string, string>) {
    await handleCitySelection(data, sessionId, selections);
    router.push(`/vehicle-selection/${sessionId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="text-center">
        <h1 className="text-4xl font-bold mb-4">Select Cities for Cops</h1>

        <form onSubmit={handleSubmit(handleCityFormSubmit)} className="space-y-4">
          {cops.map((cop: ICop) => {
            return (
              <div key={cop.id} className="flex flex-col">
                <label className="text-lg mb-1">{cop.name}</label>
                <select {...register(`cop-${cop.id}`)} className="p-2 rounded-lg bg-white text-black mb-[10px]">
                  <option value="">Select a city</option>
                  {cities.map((city: ICity) => {
                    return (
                      <option key={city.id} value={city.id}>
                        {city.name} ({city.distance}km)
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

          <button type="submit" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-2 px-4 rounded-lg transition duration-300">
            Submit
          </button>
        </form>

      </div>
    </main>
  );
}