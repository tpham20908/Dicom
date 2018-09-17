import { _ } from '../Start/controller';
import faker from "faker";
import fs from 'fs';
import { Quick } from './helper';
import { Helper } from '../Shipments/shipment_details'; 
import { Manifest } from '../Manifests/helper';
import { Selectors } from './selectors';
// import * as Writer from '../Writer/controller';
// import * as _ from '../Puppeteer/page_helper';

/**
 * Tests for Jest
 */
let page;
let browser;

let currentWeight = 0,currentPieces = 0,currentInfo = null;

export const Tests = {
    Setup: async (_page,_browser) => {
        page = _page;
        browser = _browser;
        return (page != null && browser != null && Quick.Setup(_page,_browser));
    },
        
    T1: async () => {
                
    }
}

async function CreateDomesticShipment(from, to, type, account){
    await Quick.GoToQuick();
}

async function CreateXBorderShipment(from, to){
    await Quick.GoToQuick();
}

export async function doChangetoQuick(){
	if(await page.$(Selectors.divs.quick_container) == null){
		await Quick.GoToQuick();
		let element = await page.$(Selectors.divs.quick_container);
		expect(element).toBeDefined();
	}
	await Quick.RestartShipment();
	let element = await page.$(".split-layout");
	expect(element).toBeDefined();
}

export async function doAddressDetails(shipment){
	await page.waitFor(100);
    await page.click(Selectors.inputs.from_contact);
    await page.type(Selectors.inputs.from_contact, shipment.from);
    await page.waitFor(100);
    await page.click(Selectors.inputs.to_contact);
    await page.type(Selectors.inputs.to_contact, shipment.to);
}

export async function doPaymentDetails(shipment) {
    await page.waitFor(100);
    await page.click(Selectors.inputs.billing_account);
    await page.select(Selectors.inputs.billing_account, shipment.account);
    await page.waitFor(100);
    await page.click(Selectors.inputs.payment);
    await page.select(Selectors.inputs.payment, shipment.payment);
    return true;
}

export async function doPackageType() {
    
}