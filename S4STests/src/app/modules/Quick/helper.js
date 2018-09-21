import faker from 'faker';
import * as details from '../Shipments/shipment_details';
import { Selectors } from './selectors';
import * as _ from '../Puppeteer/page_helper';

let page;
let browser;

export const PackageDetails = {
  PackageRandomizer: () => {
    return {
      type: {
        parcel: details.PARCEL_PACKAGES.array[Math.floor(Math.random() * details.PARCEL_PACKAGES.array.length)],
        freight: details.FREIGHT_PACKAGES.array[Math.floor(Math.random() * details.FREIGHT_PACKAGES.array.length)]
      },
      measurement: details.MEASUREMENTS.array[Math.floor(Math.random() * details.MEASUREMENTS.array.length)],
      quantity: Math.floor(Math.random() * 5) + 2,
      weight: Math.floor(Math.random() * 10) + 1,
      length: Math.floor(Math.random() * 15) + 5,
      width: Math.floor(Math.random() * 15) + 5,
      height: Math.floor(Math.random() * 15) + 5,
      instructions: faker.random.words(3)
    };
  }
};

export const Quick = {
  GoToQuick: async() => {
		await page.hover(Selectors.divs.shipping_sidebar);
		await page.waitForSelector(Selectors.divs.quick_selector, {timeout: 10000, visible: true});
		await page.click(Selectors.divs.quick_selector);
		await page.waitForSelector(Selectors.divs.quick_container, {timeout: 10000, visible: true});
  },
  
  AddressDetails: async(from, to) => {
		await _.Quick.GetFromContact(from);
    await _.Quick.GetToContact(to);
    /*
		await _.changeSelect.withName(Selectors.byName.payment_type, type);
		await _.changeSelect.withName(Selectors.byName.billing_account, account);

    currentAccount = account;
    */
	},

  Setup: (_page, _browser) => {
    page = _page;
    browser = _browser;
    return (page != null && browser != null);
  },

  RestartShipment: async () => {
		await Quick.GoToQuick();
		await page.click(Selectors.buttons.restart_shipment);
		await page.waitForSelector(Selectors.divs.quick_container, {timeout: 10000, visible: true});
  },
  
  AddressDetailsValidation: async (from, to, paymentType, account) => {
		let res = true, data, count = 0;
	
		// From
		data = await page.$eval(".address-bubble.active div.title", (element)=>{
			return element.innerText;
		});
		res |= data == from? 1 << (++count - 1): 0;
		
		// TO
		data = await page.$eval(".address-bubble.orange-active div.title", (element)=>{
			return element.innerText;
		});
		res |= data == to? 1 << (++count - 1): 0;
	
		// Payment Type
		data = await page.$eval("select[name=payment_type]", (element) => {
			var selected = element.options[element.selectedIndex];
			return selected.getAttribute("value");
		});
		res |= data == paymentType? 1 << (++count - 1): 0;
	
		// Account
		data = await page.$eval("select[name=billing_account]", (element) => {
			var selected = element.options[element.selectedIndex];
			return selected.getAttribute("value");
		});
		res |= data == account? 1 << (++count - 1): 0;
		return (res == Math.pow(2,count) - 1);
	
	},
}

export const changeSelect = {
	withName: async (name, value, match = null) => {
			// Can't do: changeSelect.withSelector("select[name="+name+"]", value ,match);
			match = match == null? value : match;
			let ready = false;
			while(!ready){
					await page.select("select[name="+name+"]", value);
					ready = (await page.$eval("select[name="+name+"]", (element) => {
							var selected = element.options[element.selectedIndex];
							return selected.getAttribute("value");
					})) == value;
			}
	},
	withSelector: async (selector, value, match = null) => {
			match = match == null? value : match;
			let ready = false;
			while(!ready){
					await page.select(selector, value);
					ready = (await page.$eval(selector, (element) => {
							var selected = element.options[element.selectedIndex];
							return selected.getAttribute("value");
					})) == match;
			}
	},
}