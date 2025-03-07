import { Suspense } from "react";
import Link from "next/link";
import { getCitiesAndCops, getGameSession, getSelections } from "@/lib/actions";
import { determineWinningCop } from "@/lib/utils";
import { Loading } from "@/app/components/Loading";

export default async function ResultPage({ params }: { params: { sessionId: string } }) {
  return (
    <Suspense fallback={<Loading />}>
      <ResultWrapper sessionId={params.sessionId} />
    </Suspense>
  );
}

async function ResultWrapper({ sessionId }: { sessionId: string }) {
  const { cops } = await getCitiesAndCops();
  const selections = await getSelections(sessionId);
  const gameSession = await getGameSession(sessionId);

  if (!gameSession) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
        <h1 className="text-4xl font-bold">Game session not found</h1>
      </div>
    );
  }

  // Logic to determine the winning cop
  const winningCop = await determineWinningCop(selections, gameSession, cops);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-200 to-purple-200 text-gray-800">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Result</h1>
        {winningCop ? (
          <p className="text-lg">{winningCop?.name} captured the fugitive!</p>
        ) : (
          <p className="text-lg">The fugitive escaped!</p>
        )}
      </div>

      {/* Add a button to go back to the home page */}
      <div className="mt-8">
        <Link href="/" className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-4 rounded-lg transition duration-300">
          Restart Game
        </Link>
      </div>
    </main>
  );
}