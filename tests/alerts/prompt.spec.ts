/**
 * Test Specification: Test specification for alert prompt functionality.
 * 
 * Description:
 * This test suite verifies the behavior of browser alert prompts including:
 * - Accepting prompts with input text
 * - Accepting prompts without input text
 * - Canceling prompts
 * 
 * Requirements:
 * - The page should have a Click button
 * - When the button is clicked, an alert is displayed to the user
 * - Alert window should display text "I am an alert!"
 * - The alert should have an OK, Cancel buttons and a text input field
 * - After clicking on the OK or Cancel button, the alert should be closed
 * - The user's input should be displayed on the page
 * 
 * Test Cases:
 * - "Ok - with prompt input": Accepts prompt with provided text input
 * - "Ok - without prompt input": Accepts prompt without any text input
 * - "Cancel": Dismisses the prompt dialog
 * 
 * Test Steps:
 * 1. Navigate to the alert prompt page
 * 2. Verify page heading and UI elements
 * 3. Trigger alert prompts with different actions (accept/cancel)
 * 4. Verify the displayed result text matches expected outcomes
 * 
 * Tags: Varies by test case (Sanity, Smoke, Regression)
 */

import { test, expect, Locator } from '@playwright/test';
import { TestType } from '../../utils/test_type';
import { getTestType } from '../../utils/helper';

const LABEL_HEADING = 'Alerts';
const LOCATOR_CLICK_BTN_STR = 'a.a-button';
const RESULT_TXT = 'You entered';
const RESULT_TXT_NONE = 'You entered nothing';
const RESULT_TXT_CANCEL = 'You canceled the prompt';

let click_btn: Locator;


test.beforeEach(async ({ page }, testInfo) => {

    click_btn = page.locator(LOCATOR_CLICK_BTN_STR);

    // Step: Navigate to alert prompt's page.
    await test.step('Navigate to alert prompts page.', async () => {
        await page.goto('/elements/alert/prompt');
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


// --- Alert Prompt Tests ---
[

    {   t_case: 'Ok - with prompt input', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        prompt_input: 'This is a test prompt alert input text.',
        expected_txt: 'This is a test prompt alert input text.'
    },

    {   t_case: 'Ok - without prompt input', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        prompt_input: '',
        expected_txt: RESULT_TXT_NONE
    },

    {   t_case: 'Cancel', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        prompt_input: '',
        expected_txt: RESULT_TXT_CANCEL
    }

].forEach(({ t_case, t_type, prompt_input, expected_txt }) => {   
    test('Alert Prompt test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        // Locators
        let result_text_1: Locator = page.locator('div#result');
        let result_text_2: Locator = result_text_1.locator('p#result-text.result-text');

        // Step: Click button, type prompt input text and confirm or cancel.
        await test.step('Click button, type prompt input text and confirm or cancel.', async () => {
            
            console.log('Click button.');

            page.on('dialog', async dialog => {
                console.log('Dialog type: ' + dialog.type());
                console.log('Dialog message: ' + dialog.message());
                
                if (t_case.includes('Ok')) {
                    if (prompt_input !== '') {
                        console.log('Type prompt input: ' + prompt_input);
                        await dialog.accept(prompt_input);
                    } else {
                        console.log('No prompt input text provided.');
                        await dialog.accept();
                    }
                    console.log('Click confirm.');
                } else if (t_case === 'Cancel') {
                    console.log('Click cancel.');
                    await dialog.dismiss();
                } else {
                    console.log('Unknown test case for dialog handling.');
                    await dialog.dismiss();
                }
            });

            await click_btn.click();

        });

        // Step: Verify the result text displayed on the page.
        await test.step('Verify the result text displayed on the page.', async () => {

            if (t_case === 'Ok - with prompt input') {
                await expect(result_text_1).toContainText(RESULT_TXT);
            } 

            await expect(result_text_2).toContainText(expected_txt);
            let actual_result_txt = await result_text_1.textContent();
            console.log('Result text on page: ' + actual_result_txt);
        });
    });
});
