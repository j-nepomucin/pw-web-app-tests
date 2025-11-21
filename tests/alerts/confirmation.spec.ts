/**
 * Test Specification: Test specification for alert confirmation functionality.
 *
 * Description:
 * This specification validates the behavior of a confirmation alert on the Alerts page. It performs
 * data-driven tests for both "Ok" (accept) and "Cancel" (dismiss) paths and asserts that the page
 * reflects the correct outcome text after user interaction with the dialog.
 *
 * Requirements:
 * - There should be three checkboxes on the page.
 * -The label of the checkboxes should be:
 *      "One"
 *      "Two"
 *      "Three"
 * - The user should be able to select any checkbox
 * - The Submit button should always be enabled
 * - After submitting the user should get the following result:
 *   - if no checkbox was selected, then the result is not displayed
 *   - if a checkbox has been selected, the name(s) of the selected checkbox(es) is(are) displayed to the user
 *
 * Test Cases:
 * - Cases:
 *   - Ok → accept confirm dialog; expect the result text to contain "Ok".
 *   - Cancel → dismiss confirm dialog; expect the result text to contain "Cancel".
 * - Each case is tagged using `getTestType(...)` with TestType values: Sanity, Smoke, Regression.
 *
 * Test Steps:
 * - Navigate to the Alerts page at `/elements/alert/confirm`.
 * - Verify the page heading equals "Alerts".
 * - Ensure the click button (locator: `a.a-button`) is visible.
 * - Register a `page.on('dialog')` handler that:
 *   - Accepts the dialog for the "Ok" case.
 *   - Dismisses the dialog for the "Cancel" case.
 *   - Defaults to dismiss if the case is unknown.
 * - Click the button to trigger the confirm dialog.
 * - Assert the result container (`div#result`) contains "You selected".
 * - Assert the detailed result (`p#result-text.result-text`) contains the expected selection ("Ok" or "Cancel").
 *
 * Tags: Varies by test case (Sanity, Smoke, Regression)
 */

import { test, expect, Locator } from '@playwright/test';
import { TestType } from '../../utils/test_type';
import { getTestType } from '../../utils/helper';

const LABEL_HEADING = 'Alerts';
const LOCATOR_CLICK_BTN_STR = 'a.a-button';
const RESULT_TXT = 'You selected';

let click_btn: Locator;

test.beforeEach(async ({ page }, testInfo) => {

    click_btn = page.locator(LOCATOR_CLICK_BTN_STR);

    // Step: Navigate to alerts confirmation page.
    await test.step('Navigate to alerts confirmation page.', async () => {
        await page.goto('/elements/alert/confirm');
    });

    // Step: Check page heading.
    await test.step('Check page heading.', async () => {
        await expect(page.locator('h1')).toHaveText(LABEL_HEADING);
        console.log('Page heading verified: ' + LABEL_HEADING);
    });

    // Step: Check presence of click button.
    await test.step('Check presence of click button.', async () => {
        await expect(click_btn).toBeVisible();
        console.log('Click button found.');
    });

    console.log(`Starting test: "${testInfo.title}"`);

});


test.afterEach(async ({ page }, testInfo) => {
    console.log(`Finished test: "${testInfo.title}" [${testInfo.status}]`);
});


// --- Alert Confirmation Tests ---
[

    {   t_case: 'Ok', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        expected_txt: 'Ok'
    },

    {   t_case: 'Cancel', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        expected_txt: 'Cancel'
    }

].forEach(({ t_case, t_type, expected_txt }) => {   
    test('Alert Confirmation test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        // Locators
        let result_text_1: Locator = page.locator('div#result');
        let result_text_2: Locator = result_text_1.locator('p#result-text.result-text');

        // Step: Click button and confirm or cancel.
        await test.step('Click button and confirm or cancel.', async () => {
            
            console.log('Click button and confirm or cancel.');
            
            if (t_case === 'Ok') {
                page.on('dialog', async dialog => {
                    console.log('Dialog message: ' + dialog.message());
                    await dialog.accept();
                });
            } else if (t_case === 'Cancel') {
                page.on('dialog', async dialog => {
                    console.log('Dialog message: ' + dialog.message());
                    await dialog.dismiss();
                });
            } else {
                console.log('Unknown test case for dialog handling.');
                page.on('dialog', async dialog => {
                    await dialog.dismiss();
                });
            }

            await click_btn.click();

        });

        // Step: Verify the result text displayed on the page.
        await test.step('Verify the result text displayed on the page.', async () => {
            await expect(result_text_1).toContainText(RESULT_TXT);
            await expect(result_text_2).toContainText(expected_txt);
            let actual_result_txt = await result_text_1.textContent();
            console.log('Result text on page: ' + actual_result_txt);
        });
    });
});
