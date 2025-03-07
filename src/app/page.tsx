import { handleStartClick } from "@/lib/actions";

export default async function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white">
      <div className="text-center">
        <h1 className="text-5xl font-bold mb-4">Cop and Thief Game</h1>
        <p className="text-lg mb-8">
          Join the chase! As a cop, your mission is to catch the thief before they escape. Choose your city and vehicle wisely!
        </p>
        <form action={handleStartClick}>
          <button
            type="submit"
            className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold py-3 px-6 rounded-lg transition duration-300"
          >
            Start Game
          </button>
        </form>
      </div>
    </main>
  );
}