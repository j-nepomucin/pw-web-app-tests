/**
 * Test Specification: Simple Button Submission Functionality.
 * 
 * Description:
 * This test specification validates the behavior of a simple button on the elements page.
 * It verifies that clicking a button displays the expected submission message.
 * 
 * Requirements:
 * - The user should be able to click the button.
 * - The button should be labeled Click.
 * - After pressing the button, the user should be shown confirmation that the button was pressed.
 * 
 * Test Cases:
 * - **Submitted**: Verifies that clicking the "Click" button displays "Submitted" message
 * 
 * Test Steps:
 * 1. Navigate to the simple button page (`/elements/button/simple`)
 * 2. Verify the page heading "Buttons" is visible
 * 3. Verify the "Click" button is visible
 * 4. Click the "Click" button
 * 5. Verify the expected message is displayed
 * 
 * Tags: Sanity, Smoke, Regression
 */

import { test, expect } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const TXT_HEADING = 'Buttons';
const BTN_LABEL = 'Click';
const TXT_MSG_SUBMITTED = 'Submitted';

[
    {   t_case: 'Submitted', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        expected_msg: TXT_MSG_SUBMITTED
    },

].forEach(({ t_case, t_type, expected_msg }) => {   
    test('Simple button test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {
        
        // Step: Navigate to Simple Button page and check header and click button.
        await test.step('Navigate to Simple Button page and verify elements.', async () => {
            await page.goto('/elements/button/simple');

            // Check for heading "Buttons"
            await expect(page.locator('h1', { hasText: TXT_HEADING } )).toBeVisible();

            // Check if button "Click" is visible
            await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeVisible();
        });

        // Step: Click submit button and verify message.
        await test.step('Click submit button and verify message.', async () => {

            // Click the button
            await page.locator('input', { hasText: BTN_LABEL } ).click();

            // Verify message
            await expect(page.locator('p', { hasText: expected_msg } )).toBeVisible();
        });
        
    });
});