/**
 * Test Specification: Email Input Field Validation
 * 
 * Description:
 * This test suite validates the email input field functionality, covering various valid and invalid email address formats.
 * Tests are categorized by test type (Sanity, Smoke, Regression) and verify both successful email submissions and 
 * appropriate error handling for invalid inputs.
 * 
 * Requirements:
 * - Entered text should be a valid email address
 * - "localhost" domain should be allowed
 * - User can submit this one-field form by pressing Enter
 * - After submitting the form, the text entered by the user is displayed on the page
 * 
 * Test Cases:
 * Valid Email Formats:
 * - Normal characters (e.g., josephnepomucin@icloud.com)
 * - Localhost domain (e.g., josephnepomucin@localhost)
 * - Domain with hyphens (e.g., josephnepomucin@i-cloud.com)
 * - Username with dots (e.g., joseph.nepomucin@icloud.com)
 * - Username with dots and underscores (e.g., joseph.nepomucin_2025@icloud.com)
 * - Username with dots, underscores, and hyphens (e.g., j-seph.nepomucin_2025@icloud.com)
 * - Username with special characters (e.g., j-seph.nepomucin_2025_!@icloud.com)
 * 
 * Invalid Email Formats:
 * - Empty input (mandatory field validation)
 * - Single character without domain
 * - Only special character (@)
 * - Email with whitespaces
 * - Domain with special characters
 * - Double @ symbol
 * - Domain with underscore
 * 
 * Test Steps:
 * 1. Navigate to the Email Input page and verify page elements
 * 2. Enter the test email address and submit via Enter key
 * 3. Verify the appropriate validation message is displayed
 * 4. For valid emails, verify the email address is displayed on the page
 * 
 * Tags: Sanity, Smoke, Regression
 */

import { test, expect } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const TXT_HEADING = 'Input Field';
const TXT_LABEL = 'Email';
const TXT_MSG_VALID = 'Your input was:';
const TXT_MSG_INVALID = 'Enter a valid email address.';
const TXT_MSG_MANDATORY = 'Please fill out this field.';
const TXT_MSG_MANDATORY_WEBKIT = 'Fill out this field';


test.beforeEach(async ({ }, testInfo) => {
    console.log(`Starting test: ${testInfo.title}`);
});


test.afterEach(async ({ }, testInfo) => {
    console.log(`Finished test: ${testInfo.title} [${testInfo.status}]`);
}); 


// --- Email Input Field Tests ---
[
    {   t_case: 'Valid email - normal characters', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        email_address: 'josephnepomucin@icloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal characters and localhost domain', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'josephnepomucin@localhost', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal characters and hypen in domain', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'josephnepomucin@i-cloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal chars with dots', 
        t_type: [TestType.Regression],
        email_address: 'joseph.nepomucin@icloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal chars with dots and underscore', 
        t_type: [TestType.Regression],
        email_address: 'joseph.nepomucin_2025@icloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal chars with dots, underscore and hypen', 
        t_type: [TestType.Regression],
        email_address: 'j-seph.nepomucin_2025@icloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },

    {   t_case: 'Valid email - normal chars with dots, underscore, hypen and special char', 
        t_type: [TestType.Regression],
        email_address: 'j-seph.nepomucin_2025_!@icloud.com', 
        is_valid: true, 
        result_msg: TXT_MSG_VALID
    },
    
    {   t_case: 'Invalid email - empty', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        email_address: '', 
        is_valid: false , 
        result_msg: TXT_MSG_MANDATORY
    },

    {
        t_case: 'Invalid email - single character', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        email_address: 'a', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {
        t_case: 'Invalid email - single and special character', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: '@', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {   t_case: 'Invalid email with whitespaces', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'joseph nepomucin @ icloud . com', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {   t_case: 'Invalid email with special characters', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'joseph!nepomucin@ic!loud.com', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {   t_case: 'Invalid email with double @ symbol', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'josephnepomucin@@icloud.com', 
        is_valid: false , 
        result_msg: TXT_MSG_INVALID
    },

    {   t_case: 'Valid email - normal characters and underscore in domain', 
        t_type: [TestType.Smoke, TestType.Regression],
        email_address: 'josephnepomucin@i_cloud.com', 
        is_valid: false, 
        result_msg: TXT_MSG_INVALID
    },
    
].forEach(({ t_case, t_type, email_address, is_valid, result_msg }) => {    
    test('Email address input : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page, browserName }) => {

        // Step: Navigate to Email Input page and verify elements.
        await test.step('Navigate to Email Input page and verify elements.', async () => {
            await page.goto('/elements/input/email');
            await expect(page.getByRole('heading', { name: TXT_HEADING })).toBeVisible();
            await expect(page.getByLabel(TXT_LABEL)).toBeVisible();
        });

        // Step: Enter email address and hit Enter key.
        await test.step(`Enter email address: "${email_address}" and hit Enter key.`, async () => {
            await page.getByRole('textbox', { name: TXT_LABEL }).fill(email_address);
            await page.keyboard.press('Enter');
        });

        // Step: Verify result message.
        await test.step('Verify result message.', async () => {
            // If email_address is empty or blank.
            if (email_address === '') {

                // For blank email address, change mandatory alert message to browser's native validation message.
                if (browserName === 'webkit') {
                    result_msg = TXT_MSG_MANDATORY_WEBKIT;
                }

                const validationMessage = await page.getByRole('textbox', { name: TXT_LABEL }).evaluate((el: HTMLInputElement) => el.validationMessage);
                expect(validationMessage).toBe(result_msg);

            } else {
                await expect(page.getByText(result_msg)).toBeVisible();
            }

            // For valid email address, also verify that the email address is displayed on the page.
            if (is_valid) {
                await expect(page.getByText(email_address)).toBeVisible();
            } 
        });
    }); 
});
