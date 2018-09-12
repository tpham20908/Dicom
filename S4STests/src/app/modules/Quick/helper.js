import faker from 'faker';
import * as details from '../Shipments/shipment_details';

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
  GoToQuick: async () => {
    await page.hover(".menu-item.active.hover-over.shipping");
    await page.waitForSelector(".sub-routes div:nth-child(3)");
    await page.click(".sub-routes div:nth-child(3)");
  },

  Setup: (_page, _browser) => {
    page = _page;
    browser = _browser;
    return (page != null && browser != null);
  }
}