# Cop and Thief Game

A web-based game where cops try to catch a fugitive by strategically selecting cities and vehicles.

## Deployment

The game is deployed on Vercel at
https://fugitive-assignment.vercel.app

## Setup, Development and Testing Scripts

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Production build
npm run build
npm start

# Push database schema
npm run migrate

# Seed the database
npm run seeders

# (Optional) View database
npm run studio

# Run end-to-end tests
npx playwright test tests/game.test.ts

# Run end-to-end tests in debug mode
npx playwright test tests/game.test.ts --debug
```

## Game Flow

1. **Start Game**
   - Click "Start Game" to begin
   - A new game session is created with a random fugitive location

2. **City Selection**
   - Each cop must select a different city to patrol
   - Cities have different distances from the center
   - Validation ensures no two cops can select the same city

3. **Vehicle Selection**
   - Each cop must select a vehicle
   - Available vehicles:
     - EV Bikes (2 available) - Limited range
     - EV Car (1 available) - Medium range
     - EV SUV (1 available) - Maximum range
   - Validation ensures vehicle count limits are not exceeded

4. **Result**
   - The game determines if any cop successfully caught the fugitive or not
   - A cop catches the fugitive only if all the following conditions are met:
     - The cop went to the same city as the fugitive
     - If the vehicle the cop chose has enough range to travel to the city and back