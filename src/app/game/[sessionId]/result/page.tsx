
import { prisma } from "@/lib/db";

export default async function ResultPage({ params }: { params: { sessionId: string } }) {
  const gameSession = await prisma.gameSession.findUnique({
    where: { id: params.sessionId },
    include: { selections: true, fugitiveCity: true },
  });

  if (!gameSession) return <div>Game not found</div>;

  const winningCop = gameSession.selections.find(
    (selection) => selection.cityId === gameSession.fugitiveCityId
  );

  return (
    <div>
      <h1>Result</h1>
      {winningCop ? (
        <p>Cop {winningCop.copNumber} captured the fugitive!</p>
      ) : (
        <p>The fugitive escaped!</p>
      )}
    </div>
  );
}