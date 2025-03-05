"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CitySchema } from "../lib/schema";

export function CityForm({ sessionId, copNumber }: { sessionId: string; copNumber: number }) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(CitySchema),
    defaultValues: { gameSessionId: sessionId, copNumber },
  });

  const submit = handleSubmit(async (data) => {
    await fetch("/api/game/city", { method: "POST", body: JSON.stringify(data) });
  });

  return (
    <form onSubmit={submit}>
      <input type="hidden" {...register("gameSessionId")} />
      <input type="hidden" {...register("copNumber")} />
      <select {...register("cityId")}>
        {/* Populate cities */}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}