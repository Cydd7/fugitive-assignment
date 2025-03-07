"use client";
import { useForm } from "react-hook-form";
import { ICity, ICop, ISelection } from "@/lib/types";
import { createSelections, updateSelections } from "@/lib/actions";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { createCityFormSchema } from "@/lib/schema";

export function CityForm({ sessionId, cities, cops, selections }: { sessionId: string, cities: ICity[], cops: ICop[], selections: ISelection[] }) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    // getValues,
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

  const handleCitySelection = async (data: Record<string, string>) => {
    let selectionsPayload = [];

    if (selections.length > 0) {
      selectionsPayload = selections.map((selection) => ({
        ...selection,
        cityId: parseInt(data[`cop-${selection.copId}`]),
      }));
      await updateSelections(selectionsPayload, 'city-selection');
    }
    else {
      selectionsPayload = Object.entries(data).map(([key, value]) => ({
        gameSessionId: sessionId,
        copId: parseInt(key.split('-')[1]),
        cityId: parseInt(value),
      }));
      await createSelections(selectionsPayload);
    }

    router.push(`/vehicle-selection/${sessionId}`);
  }

  console.log(sessionId, cities, cops, selections);

  return (
    <div>
      <form onSubmit={handleSubmit(handleCitySelection)}>
        {cops.map((cop: ICop) => {
          return (
            <div key={cop.id}>
              {cop.name}
              <select {...register(`cop-${cop.id}`)}>
                <option value="">Select a city</option>
                {cities.map((city: ICity) => {
                  return (
                    <option key={city.id} value={city.id}>
                      {city.name} ({city.distance}km)
                    </option>
                  );
                })}
              </select>
              {errors[`cop-${cop.id}`] && <p>{errors[`cop-${cop.id}`]?.message?.toString()}</p>}
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