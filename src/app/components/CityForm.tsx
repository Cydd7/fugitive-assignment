"use client";
import { useParams, useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { ICity, ICop, ISelection } from "@/lib/types";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCityFormSchema } from "@/lib/schema";
import { Error } from "./Error";
import { handleCitySelection } from "@/lib/utils";
import { ImageDisplay } from "./ImageDisplay";

export function CityForm({ cities, cops, selections }: { cities: ICity[], cops: ICop[], selections: ISelection[] }) {
  const router = useRouter();
  const params = useParams();
  const sessionId = params.sessionId as string;
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    watch,
  } = useForm({
    resolver: zodResolver(createCityFormSchema(cops)),
    defaultValues: {
      ...selections.reduce((acc: Record<string, string>, selection) => {
        acc[`cop-${selection.copId}`] = selection.cityId.toString();
        return acc;
      }, {}),
    },
  });
  const formValues = watch();

  async function handleCityFormSubmit(data: Record<string, string>) {
    await handleCitySelection(data, sessionId, selections);
    router.push(`/vehicle-selection/${sessionId}`);
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
      <div className="text-center max-w-4xl w-full">
        <h1 className="text-4xl font-bold mb-4">Select Cities for Cops</h1>

        <form onSubmit={handleSubmit(handleCityFormSubmit)} className="space-y-8">
          {cops.map((cop: ICop) => {
            const copId = `cop-${cop.id}`;
            const selectedCity = cities.find(city => city.id === parseInt(formValues[copId]));
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
                    className="p-2 rounded-lg bg-white text-black mb-2 w-full border-2 border-gray-300"
                  >
                    <option value="">Select a city</option>
                    {cities.map((city: ICity) => {
                      return (
                        <option key={city.id} value={city.id}>
                          {city.name} ({city.distance}km)
                        </option>
                      );
                    })}
                  </select>
                  {errors[copId] && <Error error={errors[copId]?.message?.toString() || ''} />}
                </div>

                {selectedCity && (
                  <div className="flex flex-col items-center w-32">
                    <ImageDisplay
                      src={`/images/${selectedCity.name.toLowerCase()}.png`}
                      alt={selectedCity.name}
                      width={90}
                      height={90}
                      className="mb-2"
                    />
                    <span className="font-semibold text-center">{selectedCity.name}</span>
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