import { createGameSession } from "@/lib/actions";
import { redirect } from "next/navigation";

export default async function Home() {
  const sessionId = await createGameSession();
  redirect(`/game/${sessionId}/cities`);
}