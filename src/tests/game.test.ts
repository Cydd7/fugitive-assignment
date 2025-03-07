// import { prisma } from "@/lib/db";
// import { createGameSession, selectCity, selectVehicle } from "@/lib/actions";

// describe("Game Session", () => {
//   it("should create a game session", async () => {
//     const sessionId = await createGameSession();
//     expect(sessionId).toBeDefined();
//   });

//   it("should allow city selection", async () => {
//     const sessionId = await createGameSession();
//     await selectCity({
//       gameSessionId: sessionId,
//       copNumber: 1,
//       cityId: 1,
//     });
//     const selections = await prisma.selection.findMany();
//     expect(selections.length).toBe(1);
//   });
// });