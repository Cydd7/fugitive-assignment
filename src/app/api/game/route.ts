import { NextResponse } from "next/server";
import { selectCity, selectVehicle } from "@/lib/actions";

export async function POST(req: Request) {
  const { action, data } = await req.json();
  if (action === "selectCity") {
    await selectCity(data);
  } else if (action === "selectVehicle") {
    await selectVehicle(data);
  }
  return NextResponse.json({ success: true });
}