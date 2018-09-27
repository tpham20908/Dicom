import { _ } from '../Start/controller';
import { changeSelect, Quick } from './helper';
import { Helper } from '../Shipments/shipment_details';
import { Manifest } from '../Manifests/helper';
import { Selectors } from './selectors';

let page;
let browser;

export const Tests = {
	Setup: async (_page, _browser) => {
		page = _page;
		browser = _browser;
		return (page != null && browser != null && Quick.Setup(_page, _browser));
	},	
}

export async function doChangetoQuick() {
	if (await page.$(Selectors.divs.quick_container) == null) {
		await Quick.GoToQuick();
		let element = await page.$(Selectors.divs.quick_container);
		expect(element).toBeDefined();
	}
	await Quick.RestartShipment();
	let element = await page.$(".split-layout");
	expect(element).toBeDefined();
}

export async function doAddressDetails(from, to) {
	await page.waitForSelector(Selectors.inputs.from_contact, { timeout: 10000, visible: true });
	await page.click(Selectors.inputs.from_contact);
	await page.click(".search-field input[name=query]");
	await page.type(".search-field input[name=query]", from);
	await page.waitForSelector(Selectors.divs.contact, { timeout: 15000, visible: true });
	await page.click(Selectors.divs.contact);

	await page.waitForSelector(Selectors.inputs.to_contact, { timeout: 10000, visible: true });
	await page.click(Selectors.inputs.to_contact);
	await page.click(".search-field input[name=query]");
	await page.type(".search-field input[name=query]", to);
	await page.waitForSelector(Selectors.divs.contact, { timeout: 10000, visible: true });
	await page.click(Selectors.divs.contact);
	return true;
}

export async function doPaymentDetails(account, payment) {
	await page.waitForSelector(Selectors.selects.billing_account, { timeout: 10000, visible: true });
	await page.click(Selectors.selects.billing_account);
	await page.select(Selectors.selects.billing_account, account);
	await page.waitForSelector(Selectors.selects.payment, { timeout: 10000, visible: true });
	await page.click(Selectors.selects.payment);
	await page.select(Selectors.selects.payment, payment);
	return true;
}

export async function pickupDetails(pickup_ready, pickup_closing, pickup_point, department, service_type) {
	await page.waitFor(100);
	await page.select(Selectors.selects.pickup_ready, pickup_ready);
	await page.select(Selectors.selects.pickup_closing, pickup_closing);
	await page.select(Selectors.selects.pickup_point, pickup_point);
	await page.click(Selectors.inputs.department);
	await clearField();
	await page.type(Selectors.inputs.department, department);
	await page.click(Selectors.selects.service_type);
	await page.select(Selectors.selects.service_type, service_type);
}

export async function fillUpEnvelopeForm(pkgType, quantity, instruction) {
	await page.waitFor(100);

	await page.click(Selectors.selects.package_type);
	await page.select(Selectors.selects.package_type, pkgType);

	await page.click(Selectors.inputs.instruction);
	await clearField();
	await page.type(Selectors.inputs.instruction, instruction);
	await page.keyboard.press("Tab");

	await page.click(Selectors.inputs.quantity);
	await page.type(Selectors.inputs.quantity, quantity);

	await page.click(Selectors.buttons.add_package);

	return true;
}

export async function fillUpBoxForm(pkgType, quantity, weight, length, width, height, instruction) {
	await page.waitFor(100);

	await page.click(Selectors.selects.package_type);
	await page.select(Selectors.selects.package_type, pkgType);

	await page.click(Selectors.inputs.quantity);
	await page.type(Selectors.inputs.quantity, quantity);

	await page.click(Selectors.inputs.instruction);
	await clearField();
	await page.type(Selectors.inputs.instruction, instruction);
	await page.keyboard.press("Tab");

	await page.click(Selectors.inputs.weight);
	await page.type(Selectors.inputs.weight, weight);

	await page.click(Selectors.inputs.length);
	await page.type(Selectors.inputs.length, length);

	await page.click(Selectors.inputs.width);
	await page.type(Selectors.inputs.width, width);

	await page.click(Selectors.inputs.height);
	await page.type(Selectors.inputs.height, height);

	await page.click(Selectors.buttons.add_package);

	return true;
}

export async function fillUpReferences(employee_number, invoice_number, purchase_order_number, presold_order_reference) {
	await page.click(Selectors.inputs.employee_number);
	await clearField();
	await page.type(Selectors.inputs.employee_number, employee_number);

	await page.click(Selectors.inputs.invoice_number);
	await clearField();
	await page.type(Selectors.inputs.invoice_number, invoice_number);

	await page.click(Selectors.inputs.purchase_order_number);
	await clearField();
	await page.type(Selectors.inputs.purchase_order_number, purchase_order_number);

	await page.click(Selectors.inputs.presold_order_reference);
	await clearField();
	await page.type(Selectors.inputs.presold_order_reference, presold_order_reference);

	return true;
}

export async function additionalServices(hold_for_pickup, non_conveyable, private_home_delivery, signature_required, trade_show_delivery, weekend_delivery, insurance, insurance_value) {

	if (hold_for_pickup) await page.click("label[for=HFP]");
	if (non_conveyable) await page.click("label[for=NCV]");
	if (private_home_delivery)  // await page.click("label[for=PHD]");
		if (signature_required) await page.click("label[for=PHS]");
	if (trade_show_delivery) await page.click("label[for=TRD]");
	if (weekend_delivery) await page.click("label[for=WKD]");
	if (insurance) {
		await page.click("label[for=DCV]");
		await page.click("input[label=DCV]");
		await page.type("input[label=DCV]", insurance_value);
	}

	return true;
}

const clearField = async () => {
	await page.keyboard.down('Control');
	await page.keyboard.press('KeyA');
	await page.keyboard.up('Control');
	await page.keyboard.press('Backspace');
}