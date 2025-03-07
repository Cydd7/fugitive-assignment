"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ICity, ICop, ISelection } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCityFormSchema } from "@/lib/schema";
import { Error } from "./Error";
import { handleCitySelection } from "@/lib/utils";

export function CityForm({ cities, cops, selections }: { cities: ICity[], cops: ICop[], selections: ISelection[] }) {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: zodResolver(createCityFormSchema(cops)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection.cityId.toString();
        return acc;
      }, {}),
    },
  });

  async function handleCityFormSubmit(data: Record<string, string>) {
    await handleCitySelection(data, sessionId, selections);
    router.push(`/vehicle-selection/${sessionId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
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