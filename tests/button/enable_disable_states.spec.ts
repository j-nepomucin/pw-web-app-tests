/**
 * Test Specification: Submit Button Enable/Disable States
 * 
 * Description:
 * This test suite validates the enable/disable functionality of a submit button
 * controlled by a state selector dropdown. It verifies the button's behavior
 * across multiple state transitions and validates proper UI feedback.
 * 
 * Requirements:
 * - Submit button should be disabled by default.
 * - User should be able to enable and then disable the button using the options of the Select state dropdown.
 * - The option selected in the dropdown should be applied to the button immediately.
 * - After pressing the button, the user should be shown confirmation that the button was pressed.
 * 
 * Test Cases:
 * - **Disabled**: Verifies the button is disabled by default and remains unclickable
 * - **Enabled**: Verifies the button can be enabled and submits successfully with expected message
 * - **Disabled→Enabled→Disabled**: Tests state transition sequence and verifies button behavior at each step
 * - **Disabled→Enabled→Disabled→Enabled**: Tests extended state transition sequence
 * 
 * Test Steps:
 * 1. Navigate to submit button states page
 * 2. Verify presence of all UI elements (heading, label, dropdown, button)
 * 3. Execute test case specific state transitions
 * 4. Verify button enable/disable state at each transition
 * 5. Verify expected message display after successful submission
 * 
 * Tags: Sanity, Smoke, Regression
 */

import { test, expect, Page, Locator } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const TXT_HEADING = 'Buttons';
const TXT_LABEL = 'Select state';
const BTN_LABEL = 'Submit';
const TXT_MSG_SUBMITTED = 'Submitted';
const LOCATOR_SELECT_STATE = 'select[name="select_state"]';

enum BtnState {
    Disabled = 'Disabled',
    Enabled = 'Enabled',
    Disabled_Enabled_Disabled = 'Disabled to Enabled to Disabled',
    Disabled_Enabled_Disabled_Enabled = 'Disabled to Enabled to Disabled to Enabled',
}


test.beforeEach(async ({ }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
});


test.afterEach(async ({ }, testInfo) => {
    console.log(`Finished test: ${testInfo.title} [${testInfo.status}]`);
});


async function disable_submit_btn(page: Page): Promise<Locator> {
    let btn_selector = page.locator(LOCATOR_SELECT_STATE);
    await btn_selector.selectOption('disabled');
    return btn_selector
}


async function enable_submit_btn(page: Page): Promise<Locator> {
    let btn_selector = page.locator(LOCATOR_SELECT_STATE);
    await btn_selector.selectOption('enabled');
    return btn_selector
}


async function disable_enable_disable_submit_btn(page: Page, expected_msg: string): Promise<void> {
    // Step: Disable submit button and check if submit button is disabled.
    await test.step('Disable submit button and check if submit button is disabled.', async () => {
        let btn_state = await disable_submit_btn(page);
        await expect(btn_state.locator('option:checked')).toHaveText('Disabled');
        await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeDisabled();
    });

    // Step: Enable submit button, check if button is enabled, click button and check message.
    await test.step('Enable submit button, check if button is enabled, click button and check message.', async () => {
        let btn_state = await enable_submit_btn(page);
        await expect(btn_state.locator('option:checked')).toHaveText('Enabled');
        await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeEnabled();
        await page.locator('input', { hasText: BTN_LABEL } ).click();
        await expect(page.locator('p', { hasText: expected_msg } )).toBeVisible();
    });

    // Step: Disable submit button again and check if submit button is disabled.
    await test.step('Disable submit button again and check if submit button is disabled.', async () => {
        let btn_state = await disable_submit_btn(page);
        await expect(btn_state.locator('option:checked')).toHaveText('Disabled');
        await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeDisabled();
    });
}


// --- Submit Button State Tests ---
[
    {   t_case: BtnState.Disabled, 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        expected_msg: ''
    },

    {   t_case: BtnState.Enabled, 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        expected_msg: TXT_MSG_SUBMITTED
    },

    {   t_case: BtnState.Disabled_Enabled_Disabled, 
        t_type: [TestType.Smoke, TestType.Regression],
        expected_msg: TXT_MSG_SUBMITTED
    },

    {   t_case: BtnState.Disabled_Enabled_Disabled_Enabled, 
        t_type: [TestType.Smoke, TestType.Regression],
        expected_msg: TXT_MSG_SUBMITTED
    }

].forEach(({ t_case, t_type, expected_msg }) => {   
    test('Submit button state test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        let button_state = page.locator(LOCATOR_SELECT_STATE);

        // Step: Navigate to submit button states page and check elements.
        await test.step('Navigate to submit button states page and check elements.', async () => {
            await page.goto('/elements/button/disabled');

            // Check for heading "Buttons"
            await expect(page.locator('h1', { hasText: TXT_HEADING } )).toBeVisible();

            // Check for label "Select state"
            await expect(page.locator('label', { hasText: TXT_LABEL } )).toBeVisible();

            // Check if select "select_state" dropdown is present
            await expect(button_state).toBeVisible();

            // Check if button "Click" is visible
            await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeVisible();
        });

        // TEST CASE: Disabled
        if (t_case === BtnState.Disabled) {

            // Step: Check if button state is disabled by default.
            await test.step('Check if button state is disabled by default.', async () => {
                await expect(button_state.locator('option:checked')).toHaveText('Disabled');
            });

            // Step: Check if submit button is disabled.
            await test.step('Check if submit button is disabled.', async () => {
                await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeDisabled();
            });
        
        // TEST CASE: Enabled
        } else if (t_case === BtnState.Enabled) {

            // Step: Enable button state and check if submit button is enabled.
            await test.step('Enable button state and check if submit button is enabled.', async () => {
                let btn_state = await enable_submit_btn(page);
                await expect(btn_state.locator('option:checked')).toHaveText('Enabled');
                await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeEnabled();
            });

            // Step: Click submit button and verify message.
            await test.step('Click submit button and verify message.', async () => {
                await page.locator('input', { hasText: BTN_LABEL } ).click();
                await expect(page.locator('p', { hasText: expected_msg } )).toBeVisible();
            });
        
        // TEST CASE: Disabled->Enabled->Disabled
        } else if (t_case === BtnState.Disabled_Enabled_Disabled) {

            // Step: Disable->Enable->Disable submit button sequence.
            await disable_enable_disable_submit_btn(page, expected_msg);
            
        // TEST CASE: Disabled->Enabled->Disabled->Enabled
        } else if (t_case === BtnState.Disabled_Enabled_Disabled_Enabled) {

            // Step: Disable->Enable->Disable submit button sequence.
            await disable_enable_disable_submit_btn(page, expected_msg);

            // Step: Enable submit button again and verify.
            await test.step('Enable submit button again and verify.', async () => {
                let btn_state = await enable_submit_btn(page);
                await expect(btn_state.locator('option:checked')).toHaveText('Enabled');
                await expect(page.locator('input', { hasText: BTN_LABEL } )).toBeEnabled();
            });

        } else {
            throw new Error(`Unknown test case: ${t_case}`);
        }
        
    });
});

