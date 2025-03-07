import { test, expect } from '@playwright/test';

test.describe('Cop and Thief Game E2E Tests', () => {
    const baseUrl = 'http://localhost:3000';
    const citySelectionUrl = /http:\/\/localhost:3000\/city-selection(\?.*)?/;
    const vehicleSelectionUrl = /http:\/\/localhost:3000\/vehicle-selection(\?.*)?/;
    const resultUrl = /http:\/\/localhost:3000\/result(\?.*)?/;

    test.beforeEach(async ({ page }) => {
        // Navigate to the homepage before each test
        await page.goto(baseUrl);
    });

    test('complete happy path from start to result', async ({ page }) => {
        // 1. Home Page
        await test.step('Home Page', async () => {
            // Verify home page content
            await expect(page.getByText('Cop and Thief Game')).toBeVisible();
            await expect(page.getByText('Join the chase!')).toBeVisible();
            await expect(page.getByRole('button', { name: 'Start Game' })).toBeVisible();
        });

        // 2. Start Game
        await test.step('Start Game Navigation', async () => {
            // Click start game and wait for navigation
            await page.click('text=Start Game');
            // Wait for loading to finish and city selection form to appear
            await page.waitForSelector('text=Select Cities for Cops', { state: 'visible' });
        });

        // 3. City Selection Page
        await test.step('City Selection', async () => {
            // Verify we're on the city selection page
            await expect(page).toHaveURL(citySelectionUrl);

            // Check if the form elements are present
            const selects = await page.locator('select').all();
            expect(selects.length).toStrictEqual(3);

            // Fill in the city selection form
            for (let i = 0; i < selects.length; i++) {
                await selects[i].selectOption((i + 1).toString());
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');
            // Wait for loading to finish and vehicle selection form to appear
            await page.waitForSelector('text=Select Vehicles for Cops', { state: 'visible' });
        });

        // 4. Vehicle Selection Page
        await test.step('Vehicle Selection', async () => {
            // Verify we're on the vehicle selection page
            await expect(page).toHaveURL(vehicleSelectionUrl);

            // Check if the form elements are present
            const selects = await page.locator('select').all();
            expect(selects.length).toStrictEqual(3);

            // Fill in the vehicle selection form
            for (let i = 0; i < selects.length; i++) {
                await selects[i].selectOption((i + 1).toString());
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');
            // Wait for loading to finish and result page to appear
            await page.waitForSelector('text=Result', { state: 'visible' });
        });

        // 5. Result Page
        await test.step('Result Page', async () => {
            // Verify we're on the result page
            await expect(page).toHaveURL(resultUrl);

            // Check for result page elements
            await expect(page.locator('h1')).toHaveText('Result');

            // Verify that either a cop won or the fugitive escaped
            const resultText = await page.locator('p').textContent();
            expect(resultText).toMatch(/(captured the fugitive|The fugitive escaped)/);
        });
    });

    test('form validation and error handling', async ({ page }) => {
        // 1. Start Game
        await test.step('Start Game Navigation', async () => {
            // Click start game and wait for navigation
            await page.click('text=Start Game');
            // Wait for loading to finish and city selection form to appear
            await page.waitForSelector('text=Select Cities for Cops', { state: 'visible' });
        });

        // 2. City Selection Page
        await test.step('City Selection Validation', async () => {
            // Verify we're on the city selection page
            await expect(page).toHaveURL(citySelectionUrl);

            // Check if the form elements are present
            const selects = await page.locator('select').all();
            expect(selects.length).toStrictEqual(3);

            // Submit the form
            await page.click('button[type="submit"]');

            // Check for validation error
            const errorMessage = await page.locator('text=Every cop must be assigned to a city').first();
            await expect(errorMessage).toBeVisible();

            // Select the same city for multiple cops (should show error)
            for (const select of selects) {
                await select.selectOption('1');
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');

            // Check for duplicate city error
            const duplicateError = await page.locator('text=Every cop must be assigned to a different city').first();
            await expect(duplicateError).toBeVisible();

            // Select different cities for each cop
            for (let i = 0; i < selects.length; i++) {
                await selects[i].selectOption((i + 1).toString());
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');
            // Wait for loading to finish and vehicle selection form to appear
            await page.waitForSelector('text=Select Vehicles for Cops', { state: 'visible' });
        });

        // 3. Vehicle Selection Page
        await test.step('Vehicle Selection Validation', async () => {
            // Verify we're on the vehicle selection page
            await expect(page).toHaveURL(vehicleSelectionUrl);

            // Check if the form elements are present
            const selects = await page.locator('select').all();
            expect(selects.length).toStrictEqual(3);

            // Submit the form
            await page.click('button[type="submit"]');

            // Check for validation error
            const errorMessage = await page.locator('text=Every cop must be assigned to a vehicle').first();
            await expect(errorMessage).toBeVisible();

            // Select the same vehicle for multiple cops (should show error)
            for (const select of selects) {
                await select.selectOption('1');
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');

            // Check for duplicate vehicle error
            const VehicleCountError = await page.locator('text=There are only 2 EV bikes, 1 EV car and 1 EV SUV available').first();
            await expect(VehicleCountError).toBeVisible();

            // Select different vehicles for each cop
            for (let i = 0; i < selects.length; i++) {
                await selects[i].selectOption((i + 1).toString());
                await page.waitForTimeout(500);
            }

            // Submit the form
            await page.click('button[type="submit"]');
            // Wait for loading to finish and result page to appear
            await page.waitForSelector('text=Result', { state: 'visible' });
        });
    });
}); 