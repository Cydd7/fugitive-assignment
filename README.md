<!-- This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details. -->

1. Development - Frontend and Backend
2. Database setup
3. Testing
4. Deployment


Seeding database - npx ts-node prisma/seed.ts

npx prisma format 

npx prisma db push

npx prisma studio 

To test the game, run the following command:
npx playwright test tests/game.test.ts

TODOS: 
- Finish the logic for the game
- Add scripts to support database
- Deploy Website

- Build UI
- Check for error handling (try catch)

- Create test cases
- Create Readme file

There is an edge case where the vehicle can't reach the city and come back.

In this case there is no way to assign a vehicle to the city.
cities - 60 50 40 - 120 100 80
vehicle - 120 100 60
