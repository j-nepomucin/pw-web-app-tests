/**
 * Test Specification: Password Input Field Validation
 * 
 * Description:
 * This test suite validates the password input field functionality on the Input Field page.
 * It tests various password scenarios including valid passwords, empty passwords, and passwords
 * that fail complexity requirements.
 * 
 * Requirements:
 * - Has minimum 8 characters in length
 * - At least one uppercase English letter
 * - At least one lowercase English letter
 * - At least one digit
 * - At least one special character
 * - User can submit this one-field form by pressing Enter
 * - After submitting the form, the text entered by the user is displayed on the page
 * 
 * Test Cases:
 * - **Valid password - short 8 chars only**: Tests minimum valid password with 8 characters
 *   containing uppercase, lowercase, digit, and special character 
 * - **Valid password - long**: Tests longer valid password with multiple characters
 * - **Invalid password - empty**: Tests validation when password field is left blank
 * - **Invalid password - less than 8 chars**: Tests password with only 7 characters
 * - **Invalid password - no digit**: Tests password missing numeric characters
 * - **Invalid password - no uppercase character**: Tests password without capital letters
 * - **Invalid password - no lowercase character**: Tests password without lowercase letters
 * - **Invalid password - no special character**: Tests password without special characters
 * 
 * Test Steps:
 * 1. Navigate to Password Input page and verify page elements
 * 2. Enter password into the input field and submit with Enter key
 * 3. Verify appropriate validation message is displayed
 * 4. For valid passwords, verify the password is displayed on the page
 * 
 * Tags: Sanity, Smoke, Regression
 */

import { test, expect } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const TXT_HEADING = 'Input Field';
const TXT_LABEL = 'Password';
const TXT_MSG_VALID = 'Your input was:';
const TXT_MSG_INVALID = 'Low password complexity';
const TXT_MSG_MANDATORY = 'Please fill out this field.';
const TXT_MSG_MANDATORY_WEBKIT = 'Fill out this field';

[
    {   t_case: 'Valid password - short 8 chars only', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        password: 'P@ssw0rd', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid password - long', 
        t_type: [TestType.Regression],
        password: 'P1e@seLetMeIn12345!^', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },
    
    {   t_case: 'Invalid email - empty', 
        t_type: [TestType.Sanity,TestType.Smoke, TestType.Regression],
        password: '', 
        is_valid: false , 
        result_msg: TXT_MSG_MANDATORY
    },

    {
        t_case: 'Invalid email - less than 8 chars', 
        t_type: [TestType.Smoke, TestType.Regression],
        password: 'P@sw0rd', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {
        t_case: 'Invalid email - no digit', 
        t_type: [TestType.Smoke, TestType.Regression],
        password: 'P@ssword_nodigit', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {
        t_case: 'Invalid email - no uppercase character', 
        t_type: [TestType.Smoke, TestType.Regression],
        password: 'p@ssw0rd_no_upcase_char',
        is_valid: false ,
        result_msg: TXT_MSG_INVALID
    },

    {
        t_case: 'Invalid email - no lowercase character', 
        t_type: [TestType.Smoke, TestType.Regression],
        password: 'P@SSW0RD_NO_LOWCASE_CHAR', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

     {
        t_case: 'Invalid email - no special character', 
        t_type: [TestType.Smoke, TestType.Regression],
        password: 'PassW0RDnoSpecialChar', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },
    
].forEach(({ t_case, t_type, password, is_valid, result_msg }) => {    
    test('Password input : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page, browserName }) => {

        // Step: Navigate to Email Input page and verify elements.
        await test.step('Navigate to Password Input page and verify elements.', async () => {
            await page.goto('/elements/input/passwd');
            await expect(page.getByRole('heading', { name: TXT_HEADING })).toBeVisible();
            await expect(page.getByLabel(TXT_LABEL)).toBeVisible();
        });

        // Step: Enter email address and hit Enter key.
        await test.step(`Enter password: "${password}" and hit Enter key.`, async () => {
            await page.getByRole('textbox', { name: TXT_LABEL }).fill(password);
            await page.keyboard.press('Enter');
        });

        // Step: Verify result message.
        await test.step('Verify result message.', async () => {
            // If password is empty or blank.
            if (password === '') {

                // For blank password, change mandatory alert message to browser's native validation message.
                if (browserName === 'webkit') {
                    result_msg = TXT_MSG_MANDATORY_WEBKIT;
                }

                const validationMessage = await page.getByRole('textbox', { name: TXT_LABEL }).evaluate((el: HTMLInputElement) => el.validationMessage);
                expect(validationMessage).toBe(result_msg);

            } else {
                await expect(page.getByText(result_msg)).toBeVisible();
            }

            // For valid password, also verify that the email address is displayed on the page.
            if (is_valid) {
                await expect(page.getByText(password)).toBeVisible();
            } 
        });
    }); 
});
