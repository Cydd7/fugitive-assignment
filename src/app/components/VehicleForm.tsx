"use client";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { VehicleSchema } from "../lib/schema";

export function VehicleForm({ sessionId, copNumber }: { sessionId: string; copNumber: number }) {
  const { register, handleSubmit } = useForm({
    resolver: zodResolver(VehicleSchema),
    defaultValues: { gameSessionId: sessionId, copNumber },
  });

  const submit = handleSubmit(async (data) => {
    await fetch("/api/game/vehicle", { method: "POST", body: JSON.stringify(data) });
  });

  return (
    <form onSubmit={submit}>
      <input type="hidden" {...register("gameSessionId")} />
      <input type="hidden" {...register("copNumber")} />
      <select {...register("vehicleId")}>
        {/* Populate vehicles */}
      </select>
      <button type="submit">Submit</button>
    </form>
  );
}