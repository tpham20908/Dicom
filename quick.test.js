import { _ } from './src/app/modules/Start/controller';
import { SignIn } from './src/app/modules/Signin/helper';
import * as Quick from './src/app/modules/Quick/controller';
import * as Contact from './src/app/modules/Contacts/controller';
import * as Helper from './src/app/modules/Quick/helper';
import { Manifest } from './src/app/modules/Manifests/helper';
import { FROM, TO, PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES, PARCEL_PACKAGES, BOX, ENVELOPE, DEPARTMENT } from './src/app/modules/Shipments/shipment_details';

const fs = require('fs');
let content;
let shipment;
let references;
let additionalServices;

let page;
let browser;

fs.readFile('../inputShipments/CA_DOM_Parcel_111.txt', function read(err, data) {
  if (err) {
    throw err;
  }
  content = data;
  processFile();
});

function processFile() {
  let shipmentDetail = JSON.parse(content);
  shipment = {
    from: shipmentDetail.shipment.from,
    to: shipmentDetail.shipment.to,
    payment: shipmentDetail.shipment.payment,
    account: shipmentDetail.shipment.account,
    packageType: shipmentDetail.shipment.packageType,
    quantity: shipmentDetail.shipment.quantity,
    weight: shipmentDetail.shipment.weight,
    length: shipmentDetail.shipment.length,
    width: shipmentDetail.shipment.width,
    height: shipmentDetail.shipment.height,
    instruction: shipmentDetail.shipment.instruction,
    service: shipmentDetail.shipment.service,
    ready: shipmentDetail.shipment.ready,
    closing: shipmentDetail.shipment.closing,
    department: shipmentDetail.shipment.department,
    point: shipmentDetail.shipment.point,
  };

  references = {
    employeeNumber: shipmentDetail.references.employeeNumber,
    invoiceNumber: shipmentDetail.references.invoiceNumber,
    purchaseNumber: shipmentDetail.references.purchaseNumber,
    presoldOrderNumber: shipmentDetail.references.presoldOrderNumber
  };

  additionalServices = {
    holdForPickup: shipmentDetail.additionalServices.holdForPickup,
    nonConveyable: shipmentDetail.additionalServices.nonConveyable,
    privateHomeDelivery: shipmentDetail.additionalServices.privateHomeDelivery,
    signatureRequired: shipmentDetail.additionalServices.signatureRequired,
    tradeShowDelivery: shipmentDetail.additionalServices.tradeShowDelivery,
    weekendDelivery: shipmentDetail.additionalServices.weekendDelivery,
    insurance: shipmentDetail.additionalServices.insurance,
    insuranceValue: shipmentDetail.additionalServices.insuranceValue
  };
}

// const USERNAME = "test@test.com";
// const PASSWORD = "test123";
const USERNAME = "test2@email.com";
const PASSWORD = "123456";

let btnShip = ".quick-shipment-ship-button";

beforeAll(async () => {
  await _.Run();
  await _.ChangeToDev();
}, 20000);

afterAll(() => {
  _.GetBrowser().close();
});


describe("Pre-tests", () => {
  test("Page and browser are not null", () => {
    page = _.GetPage();
    browser = _.GetBrowser();
    return expect(page && browser).toBeDefined();
  }, 20000);

  test("Sign In setup", () => {
    return expect(SignIn.Setup()).toBeTruthy();
  }, 20000);

  test("Quick setup", () => {
    return expect(!!Quick.Tests.Setup(page, browser)).toBeTruthy();
  }, 20000);

  test("Contacts setup", () => {
    return expect(Contact.Tests.Setup()).toBeTruthy();
  }, 20000);

  test("Manifest Setup", () => {
    return expect(Manifest.Setup(page, browser)).toBeTruthy();
  });

  test("Signing in", async () => {
    return expect(await SignIn.onSignIn(USERNAME, PASSWORD)).toBeTruthy();
  }, 50000);

  test("Package Randomiser bringing the right data back", async () => {
    let pkg = Helper.PackageDetails.PackageRandomizer();
    expect(pkg).toHaveProperty('type');
    expect(pkg).toHaveProperty('measurement');
    expect(pkg).toHaveProperty('quantity');
    expect(pkg).toHaveProperty('weight');
    expect(pkg).toHaveProperty('length');
    expect(pkg).toHaveProperty('width');
    expect(pkg).toHaveProperty('height');
    expect(pkg).toHaveProperty('instructions');
  }, 10000);
});


describe("Testing Domestic Parcel Shipments", () => {

  for (var i = 0; i < 2; i++) {
    describe("test #" + i + ".", () => {
      test("test", async () => {
        let noError = true;
        try {
          noError = await Quick.doChangetoQuick();

          noError = await Quick.doAddressDetails(shipment.from, shipment.to);

          noError = await Quick.doPaymentDetails(shipment.account, shipment.payment);

          noError = await Quick.pickupDetails(
            shipment.ready,
            shipment.closing,
            shipment.point,
            shipment.department,
            shipment.service
          );

          noError = await Quick.fillUpReferences(
            references.employeeNumber,
            references.invoiceNumber,
            references.purchaseNumber,
            references.presoldOrderNumber
          );

          noError = await Quick.additionalServices(
            additionalServices.holdForPickup,
            additionalServices.nonConveyable,
            additionalServices.privateHomeDelivery,
            additionalServices.signatureRequired,
            additionalServices.tradeShowDelivery,
            additionalServices.weekendDelivery,
            additionalServices.insurance,
            additionalServices.insuranceValue
          );

          noError = await Quick.fillUpBoxForm(
            shipment.packageType,
            shipment.quantity, //(i + 2) + "",
            shipment.weight,
            shipment.length,
            shipment.width,
            shipment.height,
            shipment.instruction
          );

          /*
          noError = await Quick.fillUpEnvelopeForm(
            PARCEL_PACKAGES.envelope,
            ENVELOPE.quantity,
            ENVELOPE.instruction
          );
          */

          await page.waitFor(2000);
          await page.click(btnShip);

          expect(noError).toBe(true);
        } catch (err) { console.log(err); fail(err); }
      }, 120000);
    });
  }
});