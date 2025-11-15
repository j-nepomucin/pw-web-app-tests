/**
 * Test Specification: Drag-and-Drop Image Interaction Between Two Rectangular Drop Zones.
 *
 * Description
 * This specification defines a parameterized Playwright test suite exercising drag-and-drop
 * behavior of an image between two rectangular drop targets (#rect-droppable1 and
 * #rect-droppable2) on the /elements/dragndrop/images page. The suite validates both
 * successful (positive) and unsuccessful (negative) drop scenarios, including repeated
 * loop-back sequences where the image is shuttled back and forth multiple times.
 * 
 * Requirements:
 * - There should be two squares on the page
 * - There should be a smiley in the top square
 * - The smiley can be dragged from square to square an infinite number of times
 * - When dropping the smiley into any of the squares, the text "Dropped!" should appear in this square
 * - A square without a smiley must be completely empty
 *
 * Test Cases:
 * - Positive cases:
 *   1. Single forward drag: Box_1 -> Box_2
 *   2. Forward and back: Box_1 -> Box_2 -> Box_1
 *   3. Loop-back with 1 repetition: (Box_1 -> Box_2 -> Box_1) x 2 total cycles
 *   4. Loop-back with 2 repetitions: (Box_1 -> Box_2 -> Box_1) x 3 total cycles
 *   Expected outcome: Box 2 displays "Dropped!" and image presence toggles appropriately.
 *
 * - Negative cases:
 *   1. Drag near (just outside) Box_2: Box_1 -> outside Box_2
 *   2. Drag near Box_2 then return: Box_1 -> outside Box_2 -> Box_1
 *   3. Loop-back with 1 repetition of near-drop
 *   4. Loop-back with 2 repetitions of near-drop
 *   Expected outcome: Box 2 never displays "Dropped!" text; image remains or returns to Box_1.
 *
 * Tags: Varies by test case (Sanity, Smoke, Regression)
 */

import { test, expect, Locator} from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';
import { get_bounding_box_info } from './helper.ts';

const LABEL_HEADING = 'Drag-n-drop';
const LABEL_BOX_DROPPED = 'Dropped!';
const RECT_BOX_1 = '#rect-droppable1';
const RECT_BOX_2 = '#rect-droppable2';
const X_OFFSET = 10;


[
    // Positive test cases
    {   t_case: 'From Box_1->Box_2', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        repeat: 0,
        is_loop_back: false,
        is_positive: true,
        expected_drop_box_txt: LABEL_BOX_DROPPED
    },

    {   t_case: 'From Box_1->Box_2->Box_1', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        repeat: 0,
        is_loop_back: true,
        is_positive: true,
        expected_drop_box_txt: LABEL_BOX_DROPPED
    },

    {   t_case: 'From Box_1->Box_2->Box_1 (1x loop back)', 
        t_type: [TestType.Smoke, TestType.Regression],
        repeat: 1,
        is_loop_back: true,
        is_positive: true,
        expected_drop_box_txt: LABEL_BOX_DROPPED
    },

    {   t_case: 'From Box_1->Box_2->Box_1 (2x loop back)', 
        t_type: [TestType.Regression],
        repeat: 2,
        is_loop_back: true,
        is_positive: true,
        expected_drop_box_txt: LABEL_BOX_DROPPED
    },

    // Negative test cases
    {   t_case: 'From Box_1-> outside Box_2', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        repeat: 0,
        is_loop_back: false,
        is_positive: false,
        expected_drop_box_txt: ''
    },

    {   t_case: 'From Box_1-> outside Box_2->Box_1', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        repeat: 0,
        is_loop_back: true,
        is_positive: false,
        expected_drop_box_txt: ''
    },

    {   t_case: 'From Box_1-> outside Box_2->Box_1 (1x loop back)', 
        t_type: [TestType.Smoke, TestType.Regression],
        repeat: 1,
        is_loop_back: true,
        is_positive: false,
        expected_drop_box_txt: ''
    },

    {   t_case: 'From Box_1-> outside Box_2->Box_1 (2x loop back)', 
        t_type: [TestType.Regression],
        repeat: 2,
        is_loop_back: true,
        is_positive: false,
        expected_drop_box_txt: ''
    },

].forEach(({ t_case, t_type, repeat, is_loop_back, is_positive, expected_drop_box_txt }) => {   
    test('Drag and drop image test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        let drop_box_1: Locator = page.locator(RECT_BOX_1);
        let drop_box_2: Locator = page.locator(RECT_BOX_2);
        let content_box: Locator = page.locator('div.content');

        // Step: Navigate to drag and drop image page.
        await test.step('Navigate to drag and drop image page.', async () => {
            await page.goto('/elements/dragndrop/images');
            console.log('Before drag and drop step:');
        });

        // Verify page heading
        await test.step('Verify page heading', async () => {
            let page_heading = page.locator('h1');
            await expect(page_heading).toHaveText(LABEL_HEADING);
            console.log('"' + await page_heading.textContent() + ' text found on page.');
        });

        // Step: Verify drag and drop boxes presence and print their bounding box info.
        await test.step('Verify drag and drop boxes presence and print their bounding box info.', async () => {
            // Verify drop box 1 presence
            await expect(page.locator(RECT_BOX_1)).toBeVisible();
            // Print initial location and dimensions of drop_box to standard output
            await get_bounding_box_info(drop_box_1, RECT_BOX_1);

            // Verify dragable box presence
            await expect(page.locator(RECT_BOX_2)).toBeVisible();
            // Print initial location and dimensions of drag_box to standard output
            await get_bounding_box_info(drop_box_2, RECT_BOX_2);
        });
        
        // Locate image presence inside box 1
        await test.step('Locate image presence inside box 1', async () => {
            let image_in_box_1 = drop_box_1.locator('img');
            await expect(image_in_box_1).toBeVisible();
            console.log('Image found inside ' + RECT_BOX_1);

        });

        // Step: Perform drag and drop action and verify result.
        await test.step('Perform drag and drop action and verify result.', async () => {
           
            let image_in_box_1 = drop_box_1.locator('img');
            let image_in_box_2 = drop_box_2.locator('img');
            let image_in_content = content_box.locator('img');
            
            // Perform drag and drop - positive case only
            if (is_positive) {

                switch (is_loop_back) {
                    case false:
                        // Drag image from box 1 to box 2
                        await image_in_box_1.dragTo(drop_box_2);
                        console.log('Dragged image from ' + RECT_BOX_1 + ' to ' + RECT_BOX_2);

                        // Verify image is now in box 2
                        await expect(image_in_box_2).toBeVisible();
                        console.log('Image found inside ' + RECT_BOX_2);

                        // Verify DROP_BOX_2 text
                        await expect(drop_box_2).toHaveText(expected_drop_box_txt);
                        console.log(RECT_BOX_2 + ' has text: ' + '"' + expected_drop_box_txt + '"');
                        break;

                    case true:
                        for (let i = 0; i <= repeat; i++) {
                            // Drag image from box 1 to box 2
                            await image_in_box_1.dragTo(drop_box_2);
                            console.log('Dragged image from ' + RECT_BOX_1 + ' to ' + RECT_BOX_2);

                            // Verify image is now in box 2
                            await expect(image_in_box_2).toBeVisible();
                            console.log('Image found inside ' + RECT_BOX_2);

                            // Verify DROP_BOX_2 text
                            await expect(drop_box_2).toHaveText(expected_drop_box_txt);
                            console.log(RECT_BOX_2 + ' has text: ' + '"' + expected_drop_box_txt + '"');

                            // Drag image back from box 2 to box 1
                            await image_in_box_2.dragTo(drop_box_1);
                            console.log('Dragged image back from ' + RECT_BOX_2 + ' to ' + RECT_BOX_1);

                            // Verify image is now back in box 1
                            await expect(image_in_box_1).toBeVisible();
                            console.log('Image found inside ' + RECT_BOX_1);
                        }
                        break;
                } 

            } else { // Perform drag and drop - negative case only

                console.log('Drop image outside drop box 2 area.');

                let drop_box_2_bb = await drop_box_2.boundingBox();
                let target_x: number | undefined = undefined;
                let target_y: number | undefined = undefined;

                if (drop_box_2_bb) {
                    target_x = drop_box_2_bb.x + X_OFFSET;
                    target_y = drop_box_2_bb.y;
                }

                switch (is_loop_back) {
                    case false:
                        // Drag image from box 1 to just outside box 2
                        if (target_x !== undefined && target_y !== undefined) {
                            await image_in_box_1.dragTo(content_box, { targetPosition: { x: target_x, y: target_y } });
                        }
                        console.log('Dragged image from ' + RECT_BOX_1 + ' and dropped just outside of ' + RECT_BOX_2);
                        break;
                    
                    case true:
                        for (let i = 0; i <= repeat; i++) {
                            // Drag image from box 1 to just outside box 2
                            if (target_x !== undefined && target_y !== undefined) {
                                await image_in_box_1.dragTo(content_box, { targetPosition: { x: target_x, y: target_y } });
                            }
                            console.log('Dragged image from ' + RECT_BOX_1 + ' and dropped just outside of ' + RECT_BOX_2);

                            // Drag image back from outside box 2 to box 1
                            await image_in_content.dragTo(drop_box_1);
                            console.log('Dragged image back to ' + RECT_BOX_1);
                        }
                        break;
                }
            }
        });
    });
});