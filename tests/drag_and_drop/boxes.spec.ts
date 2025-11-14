/**
 * Test Specification: Box Drag and Drop Functionality
 * 
 * Description:
 * This test suite validates the drag-and-drop functionality of draggable and droppable box elements.
 * It includes both positive and negative test scenarios to ensure proper behavior of the drag-and-drop interface.
 * 
 * Requirements:
 * - There should be two squares on the page
 * - The bottom square must be draggable
 * - When dragging the bottom square to the top one, the text "Dropped!" should appear in the top square.
 * - The bottom square can only be dragged once
 * 
 * Test Cases:
 * 1. **Drag-me inside Drop-here** (Positive Test)
 *    - Type: Sanity, Smoke, Regression
 *    - Validates that dragging the drag box into the drop zone updates the drop box text to "Dropped!"
 * 
 * 2. **Drag-me outside Drop-here** (Negative Test)
 *    - Type: Smoke, Regression
 *    - Validates that dragging the drag box outside the drop zone keeps the drop box text as "Drop here"
 * 
 * Test Steps:
 * 1. Navigate to the drag-and-drop boxes page at '/elements/dragndrop/boxes'
 * 2. Verify page heading displays "Drag-n-drop"
 * 3. Verify drop box is present with text "Drop here"
 * 4. Verify drag box is present with text "Drag me"
 * 5. Log initial bounding box information for both elements
 * 6. Perform drag-and-drop action (inside or outside based on test case)
 * 7. Verify the drop box text matches expected result
 * 8. Log final bounding box information for both elements
 * 
 * Tags: Varies by test case (Sanity, Smoke, Regression)
 */

import { test, expect, Locator, ElementHandle } from '@playwright/test';
import { getTestType } from '../../utils/helper';
import { TestType } from '../../utils/test_type';

const LABEL_HEADING = 'Drag-n-drop';
const LABEL_DRAG_BOX = 'Drag me';
const LABEL_DROP_BOX = 'Drop here';
const LABEL_BOX_DROPPED = 'Dropped!';
const RECT_DROP_BOX = '#rect-droppable';
const RECT_DRAG_BOX = '#rect-draggable';
const LOCATOR_DROP_BOX_TXT = '#text-droppable';
const X_OFFSET = 10;


async function get_bounding_box_info(element: Locator, label: string) {
    let element_handler: ElementHandle<SVGElement | HTMLElement> | null = await element.elementHandle();
    if (element_handler) {
        let element_bb = await element_handler.boundingBox();
        if (element_bb) {
            console.log(label + ` bounding box top left location 1 -> x:${element_bb.x.toFixed(1)} y:${element_bb.y.toFixed(1)} | dimensions -> width:${element_bb.width.toFixed(1)} height:${element_bb.height.toFixed(1)}`);
        } else {
            let element_rect = await element_handler.evaluate(el => {
                let element_rect = el.getBoundingClientRect();
                return { x: element_rect.x, y: element_rect.y, width: element_rect.width, height: element_rect.height };
            });
            console.log(label + ` rectangle top lect location -> x:${element_rect.x.toFixed(1)} y:${element_rect.y.toFixed(1)} | dimensions -> width:${element_rect.width.toFixed(1)} height:${element_rect.height.toFixed(1)}`);
        }
    } else {
        console.log(label + ' box not found');
    }
}   


[
    {   t_case: 'Drag-me inside Drop-here', 
        t_type: [TestType.Sanity, TestType.Smoke, TestType.Regression],
        is_positive: true,
        expected_drop_box_txt: LABEL_BOX_DROPPED
    },

    {   t_case: 'Drag-me outside Drop-here', 
        t_type: [TestType.Smoke, TestType.Regression],
        is_positive: false,
        expected_drop_box_txt: LABEL_DROP_BOX
    },

].forEach(({ t_case, t_type, is_positive, expected_drop_box_txt }) => {   
    test('Drag and drop box test : ' + t_case, { tag: [ getTestType(t_type) ] }, async ({ page }) => {

        let drag_box: Locator = page.locator(RECT_DRAG_BOX);
        let drop_box: Locator = page.locator(RECT_DROP_BOX);
        let drop_box_txt: Locator = page.locator(LOCATOR_DROP_BOX_TXT);
        let content_box: Locator = page.locator('div.content');

        // Step: Navigate to drag and drop boxes page and check elements.
        await test.step('Navigate to drag and drop boxes page and check elements.', async () => {
            await page.goto('/elements/dragndrop/boxes');
            console.log('Before drag and drop step:');

            // Verify page heading
            await expect(page.locator('h1')).toHaveText(LABEL_HEADING);

            // Verify drop box presence
            await expect(page.locator(RECT_DROP_BOX)).toHaveText(LABEL_DROP_BOX);

            // Print initial location and dimensions of drop_box to standard output
            await get_bounding_box_info(drop_box, LABEL_DROP_BOX);

            // Verify dragable box presence
            await expect(page.locator(RECT_DRAG_BOX)).toHaveText(LABEL_DRAG_BOX);

            // Print initial location and dimensions of drag_box to standard output
            await get_bounding_box_info(drag_box, LABEL_DRAG_BOX);

        });

        // Step: Perform drag and drop action and verify result.
        await test.step('Perform drag and drop action and verify result.', async () => {
            console.log('\nAfter drag and drop step:');
            
            // Perform drag and drop
            if (is_positive) {
                // Positive drag and drop - drag box inside drop box
                await drag_box.dragTo(drop_box);
            } else {
                // Negative drag and drop - drag box outside drop box
                let drop_box_bb = await drop_box.boundingBox();
                let target_x: number | undefined = undefined;
                let target_y: number | undefined = undefined;
                if (drop_box_bb) {
                    target_x = drop_box_bb.x + X_OFFSET;
                    target_y = drop_box_bb.y;
                    await drag_box.dragTo(content_box, { targetPosition: { x: target_x, y: target_y } });
                }
            }

            // Verify drop box text after drop
            await expect(drop_box_txt).toHaveText(expected_drop_box_txt);

            // Print new location and dimensions of drop_box to standard output
            await get_bounding_box_info(drop_box, LABEL_DROP_BOX);

            // Print initial location and dimensions of drop_box to standard output
            await get_bounding_box_info(drag_box, LABEL_DRAG_BOX);

        });

    });
});

