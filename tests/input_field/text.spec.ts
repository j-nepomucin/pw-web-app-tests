/**
 * Test Specification: Text Input Field Validation
 * 
 * Description:
 * This test suite validates the text input field functionality including:
 * - Valid input patterns (alphanumeric with hyphens and underscores)
 * - Invalid input patterns (special characters, whitespaces, empty values)
 * - Minimum length validation (2 characters)
 * - Maximum length validation (25 characters)
 * - Browser-specific validation message handling (Webkit)
 * 
 * Requirements:
 * - This is a required field
 * - User should be able to enter text into this field
 * - Text should be a valid string consisting of English letters, numbers, underscores or hyphens
 * - Text length limits:
 *   - Max: 25 characters
 *   - Min: 2 characters
 * - User can submit this one-field form by pressing Enter
 * - After submitting the form, the text entered by the user is displayed on the page
 * 
 * Test Cases:
 * - Valid string with normal chars, hyphens and underscores
 * - Valid string with normal chars only
 * - Valid string with underscores
 * - Valid string with hyphens
 * - Invalid empty string
 * - Invalid single character
 * - Invalid single special character
 * - Invalid string with whitespaces
 * - Invalid string with special characters
 * - Invalid string exceeding max length (25 chars)
 * - Invalid string with both special chars and exceeding max length
 * 
 * Test Steps:
 * 1. Navigate to Input Field page and verify page elements
 * 2. Enter test input string and submit via Enter key
 * 3. Verify validation message(s) or success message
 * 4. For valid inputs, verify the input is displayed on the page
 * 
 * Tags: Sanity, Smoke, Regression
 */

import { test, expect } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const TXT_HEADING = 'Input Field';
const TXT_LABEL = 'Text string';
const TXT_MSG_VALID = 'Your input was:';
const TXT_MSG_MANDATORY = 'Please fill out this field.';
const TXT_MSG_MANDATORY_WEBKIT = 'Fill out this field';

[
    {   t_case: 'Valid string - normal chars, hypens and underscores', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        input_str: 'This_Is-A_validString-123', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },
    
    {   t_case: 'Valid string - normal chars', 
        t_type: [TestType.Regression],
        input_str: 'ThisIsValidString123', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },
    
    {   t_case: 'Valid string - with underscores', 
        t_type: [TestType.Regression],
        input_str: 'This_is_valid_string_123', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid string - with hyphens', 
        t_type: [TestType.Regression],
        input_str: 'This-is-valid-string-123', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Invalid string - empty', 
        t_type: [TestType.Sanity,TestType.Smoke, TestType.Regression],
        input_str: '', 
        is_valid: false , 
        result_msg: TXT_MSG_MANDATORY
    },

    {
        t_case: 'Invalid string - single character', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: 'a', 
        is_valid: false , 
        result_msg: 'Please enter 2 or more characters'
    },

    {
        t_case: 'Invalid string - single and special character', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: '@', 
        is_valid: false , 
        result_msg: ['Please enter 2 or more characters', 'Enter a valid string consisting of letters, numbers, underscores or hyphens']
    },

    {   t_case: 'Invalid string with whitespaces', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: 'Invalid string w spaces', 
        is_valid: false , 
        result_msg: 'Enter a valid string consisting of letters, numbers, underscores or hyphens'
    },

    {   t_case: 'Invalid string with special characters', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: 'Invalid_string_w_special$#@!', 
        is_valid: false , 
        result_msg: 'Enter a valid string consisting of letters, numbers, underscores or hyphens'
    },

    {   t_case: 'Invalid string exceeds max chars', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: 'Invalid_string_0123456789-ExceedsMaxChars', 
        is_valid: false, 
        result_msg: 'Please enter no more than 25 characters'
    },

    {   t_case: 'Invalid string exceeds max chars and contain special chars', 
        t_type: [TestType.Smoke, TestType.Regression],
        input_str: 'Invalid_string_speci@l_chars!_&_ExceedsMaxChars', 
        is_valid: false, 
        result_msg: ['Please enter no more than 25 characters', 'Enter a valid string consisting of letters, numbers, underscores or hyphens']
    },
    
].forEach(({ t_case, t_type, input_str, is_valid, result_msg }) => {    
    test('Simple input field : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page, browserName }) => {

        // Step: Navigate to Input Field page and verify elements.
        await test.step('Navigate to Input Field page and verify elements.', async () => {
            await page.goto('/elements/input/simple');
            await expect(page.getByRole('heading', { name: TXT_HEADING })).toBeVisible();
            await expect(page.getByLabel(TXT_LABEL)).toBeVisible();
        });

        // Step: Enter input string and hit Enter key.
        await test.step(`Enter input string: "${input_str}" and hit Enter key.`, async () => {
            await page.getByRole('textbox', { name: TXT_LABEL }).fill(input_str);
            await page.keyboard.press('Enter');
        });

        // Step: Verify result message.
        await test.step('Verify result message.', async () => {
            // Check for result message(s). There can be multiple messages for invalid input.
            if (Array.isArray(result_msg)) {
                for (const msg of result_msg) {
                    await expect(page.getByText(msg)).toBeVisible();
                }

            // If input_str is empty or blank.
            } else if (input_str === '') {

                // For empty input, change mandatory alert message to browser's native validation message.
                if (browserName === 'webkit') {
                    result_msg = TXT_MSG_MANDATORY_WEBKIT;
                }

                const validationMessage = await page.getByRole('textbox', { name: TXT_LABEL }).evaluate((el: HTMLInputElement) => el.validationMessage);
                expect(validationMessage).toBe(result_msg);

            } else {
                await expect(page.getByText(result_msg)).toBeVisible();
            }

            // For valid input, also verify that the input string is displayed on the page.
            if (is_valid) {
                await expect(page.getByText(input_str)).toBeVisible();
            } 
        });
    }); 
});
