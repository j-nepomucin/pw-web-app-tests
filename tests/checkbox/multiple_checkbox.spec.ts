/**
 * Test Specification: Multiple Checkbox Selection and Result Verification
 *
 * Description:
 * Validates presence and visibility of the page heading, three checkboxes, and a submit button on the route: /elements/checkbox/mult_checkbox.
 * Exercises selection combinations for labels "One", "Two", and "Three", including the empty selection.
 * Confirms that submitting the current selection renders the expected normalized result text in the UI.
 * 
 * Requirements:
 * - There should be three checkboxes on the page.
 * - The label of the checkboxes should be:
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
 * - Select none  → expected result: "" (no text)
 * - Select one   → expected result: "one"
 * - Select one,two → expected result: "one, two"
 * - Select one,three → expected result: "one, three"
 * - Select two,three → expected result: "two, three"
 * - Select one,two,three → expected result: "one, two, three"
 *
 * Tags: Varies by test case (Sanity, Smoke, Regression)
 */

import { test, expect, Locator } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const LABEL_HEADING = 'Checkboxes';
const LABEL_CHKBOX_1 = 'One';
const LABEL_CHKBOX_2 = 'Two';
const LABEL_CHKBOX_3 = 'Three';
const LABEL_NON_SELECTED_CHKBOX = '';
const RESULT_TXT = 'Selected checkboxes:';

const LOCATOR_CHKBOX_STR = 'input[type="checkbox"]';
const LOCATOR_SUBMIT_BTN_STR = 'input[type="submit"]';

let checkbox_1: Locator;
let checkbox_2: Locator;
let checkbox_3: Locator;
let submit_btn: Locator;

test.beforeEach(async ({ page }, testInfo) => {
    checkbox_1 = page.locator(LOCATOR_CHKBOX_STR).nth(0);
    checkbox_2 = page.locator(LOCATOR_CHKBOX_STR).nth(1);
    checkbox_3 = page.locator(LOCATOR_CHKBOX_STR).nth(2);
    submit_btn = page.locator(LOCATOR_SUBMIT_BTN_STR);

    // Step: Navigate to checkbox selection page.
    await test.step('Navigate to checkbox selection page.', async () => {
        await page.goto('/elements/checkbox/mult_checkbox');
    });

    // Step: Check page heading.
    await test.step('Check page heading.', async () => {
        await expect(page.locator('h1')).toHaveText(LABEL_HEADING);
        console.log('Page heading verified: ' + LABEL_HEADING);
    });

    // Step: Check presence of checkboxes.
    await test.step('Check presence of checkboxes.', async () => {
        await expect(checkbox_1).toBeVisible();
        await expect(checkbox_2).toBeVisible();
        await expect(checkbox_3).toBeVisible();
        console.log('Three checkboxes found.');
    });

    // Step: Check presence of submit button.
    await test.step('Check presence of submit button.', async () => {
        await expect(submit_btn).toBeVisible();
        console.log('Submit button found.');
    });

    console.log(`Starting test: "${testInfo.title}`);

});

test.afterEach(async ({ page }, testInfo) => {
    checkbox_1 = page.locator(LOCATOR_CHKBOX_STR).nth(0);
    checkbox_2 = page.locator(LOCATOR_CHKBOX_STR).nth(1);
    checkbox_3 = page.locator(LOCATOR_CHKBOX_STR).nth(2);

    // Deselect all checkboxes
    if (await checkbox_1.isChecked()) {
        await checkbox_1.click();
    }
    if (await checkbox_2.isChecked()) {
        await checkbox_2.click();
    }
    if (await checkbox_3.isChecked()) {
        await checkbox_3.click();
    }

    console.log(`Finished test: "${testInfo.title}" [${testInfo.status}]`);
});


test.afterAll(async () => {
    console.log('All checkbox tests finished.');
});


[
    {   t_case: 'Select none', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        chk_box_selected: [],
        expected_drop_box_txt: LABEL_NON_SELECTED_CHKBOX
    },

    {   t_case: 'Select one', 
        t_type: [TestType.Regression],
        chk_box_selected: [LABEL_CHKBOX_1],
        expected_drop_box_txt: 'one'
    },

    {   t_case: 'Select one and two', 
        t_type: [TestType.Smoke, TestType.Regression],
        chk_box_selected: [LABEL_CHKBOX_1, LABEL_CHKBOX_2],
        expected_drop_box_txt: 'one, two'
    },

    {   t_case: 'Select one and three', 
        t_type: [TestType.Regression],
        chk_box_selected: [LABEL_CHKBOX_1, LABEL_CHKBOX_3],
        expected_drop_box_txt: 'one, three'
    },

    {   t_case: 'Select two and three', 
        t_type: [TestType.Regression],
        chk_box_selected: [LABEL_CHKBOX_2, LABEL_CHKBOX_3],
        expected_drop_box_txt: 'two, three'
    },

    {   t_case: 'Select one, two and three', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        chk_box_selected: [LABEL_CHKBOX_1, LABEL_CHKBOX_2, LABEL_CHKBOX_3],
        expected_drop_box_txt: 'one, two, three'
    },

].forEach(({ t_case, t_type, chk_box_selected, expected_drop_box_txt }) => {   
    test('Checkbox test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        let checkbox_1: Locator = page.locator(LOCATOR_CHKBOX_STR).nth(0);
        let checkbox_2: Locator = page.locator(LOCATOR_CHKBOX_STR).nth(1);
        let checkbox_3: Locator = page.locator(LOCATOR_CHKBOX_STR).nth(2);
        let submit_btn: Locator = page.locator(LOCATOR_SUBMIT_BTN_STR);
        let result_text_1: Locator = page.locator('div#result');
        let result_text_2: Locator = result_text_1.locator('p#result-text.result-text');

        // Step: Select specified checkboxes.
        await test.step('Select specified checkboxes.', async () => {
            // Deselect all first
            if (await checkbox_1.isChecked()) {
                await checkbox_1.click();
            }
            if (await checkbox_2.isChecked()) {
                await checkbox_2.click();
            }
            if (await checkbox_3.isChecked()) {
                await checkbox_3.click();
            }

            // Select required checkboxes - based on test data / test case
            for (const label of chk_box_selected) {
                if (label === LABEL_CHKBOX_1) {
                    await checkbox_1.click();
                } else if (label === LABEL_CHKBOX_2) {
                    await checkbox_2.click();
                } else if (label === LABEL_CHKBOX_3) {
                    await checkbox_3.click();
                }
            }
            console.log('Selected checkboxes: ' + chk_box_selected.join(', '));

        });

        // Step: Submit checkbox selection and verify the result.
        await test.step('Submit checkbox selection and verify the result.', async () => {

            // Click Submit button
            await submit_btn.click();
            console.log('Clicked Submit button.');

            // Verify the result text
            if (expected_drop_box_txt !== LABEL_NON_SELECTED_CHKBOX) {
                await expect(result_text_1).toContainText(RESULT_TXT);
                await expect(result_text_2).toContainText(expected_drop_box_txt);
                console.log('Result text verified: ' + expected_drop_box_txt);

                // Print result text
                let actual_result_txt = await result_text_1.textContent();
                console.log('Result text: ' + actual_result_txt);
            }
        });
    });
});
