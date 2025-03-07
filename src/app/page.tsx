import { handleStartClick } from "@/lib/actions";

export default async function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <form action={handleStartClick}>
        <button type="submit">Start</button>
      </form>
    </main>
  );
}