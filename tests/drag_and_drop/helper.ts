import { ElementHandle, Locator } from "@playwright/test";

// This helper function retrieves and logs the bounding box information of a given element.
export async function get_bounding_box_info(element: Locator, label: string) {
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
            console.log(label + ` rectangle top left location -> x:${element_rect.x.toFixed(1)} y:${element_rect.y.toFixed(1)} | dimensions -> width:${element_rect.width.toFixed(1)} height:${element_rect.height.toFixed(1)}`);
        }
    } else {
        console.log(label + ' box not found');
    }
}   