import { _ } from './src/app/modules/Start/controller';
import { SignIn } from './src/app/modules/Signin/helper';
import * as Quick from './src/app/modules/Quick/controller';
import * as Contact from './src/app/modules/Contacts/controller';
import { Manifest } from './src/app/modules/Manifests/helper';

const fs = require('fs');
let content;
let addresses;
let payment;
let boxShipment;
let envelopeShipment;
let pickupDetails;
let references;
let additionalServices = {
  holdForPickup: false,
  nonConveyable: false,
  privateHomeDelivery: false,
  signatureRequired: false,
  tradeShowDelivery: false,
  weekendDelivery: false,
  insurance: false,
};

let page;
let browser;

// const USERNAME = "test@test.com";
// const PASSWORD = "test123";
const USERNAME = "test2@email.com";
const PASSWORD = "123456";

let btnShip = ".quick-shipment-ship-button";

// fs.readFile('../inputShipments/CA_DOM_Parcel_112.txt', function read(err, data) {
fs.readFile('../inputShipments/CA_DOM_Parcel_113.txt', function read(err, data) {
  if (err) {
    throw err;
  }
  content = data;
  processFile();
});

// used to read file which is written from CSV
function processFile() {
  let res = JSON.parse(content);

  let addServicesObj = res.AdditionalServices.split(" ");

  addServicesObj.map(s => {
    let key = s.split(":")[0];
    let value = s.split(":")[1];
    if (key === "HFP")  additionalServices.holdForPickup = value;
    if (key === "NCV")  additionalServices.nonConveyable = value;
    if (key === "PHD")  additionalServices.privateHomeDelivery = value;
    if (key === "PHS")  additionalServices.signatureRequired = value;
    if (key === "TRD")  additionalServices.tradeShowDelivery = value;
    if (key === "WKD")  additionalServices.weekendDelivery = value;
    if (key === "DCV") {
      additionalServices.insurance = true;
      additionalServices.insuranceValue = value;
    }
  });

  addresses = {
    from: res.FromAddress + " " + res.FromCity + " " + res.FromProvince,
    to: res.ToName
  }
  payment = {
    type: "PREPAID",
    account: res.AccountID
  }
  boxShipment = {
    packageType: "BX",
    quantity: res.NbPiece.split(" ")[0],
    weight: res.Weight.split(" ")[0],
    length: res.Length.split(" ")[0],
    width:  res.Width.split(" ")[0],
    height: res.Height.split(" ")[0],
    instruction: res.Instruction1
  };
  envelopeShipment = {
    packageType: "EV",
    quantity: res.NbPiece.split(" ")[1],
    instruction: ""
  };
  pickupDetails = {
    service: res.ShipmentType,
    ready: "16:00",
    closing: "18:00",
    department: res.Department,
    point: "MB"
  }
  references = {
    employeeNumber: "4",
    invoiceNumber: res.Invoice,
    purchaseNumber: res.PurchaseOrderNumber,
    presoldOrderNumber: "1"
  };
}

/*
// used to read file which is manually written
function processFile() {
  let res = JSON.parse(content);
  addresses = {
    from: res.addresses.from,
    to: res.addresses.to
  };
  payment = {
    type: res.payment.type,
    account: res.payment.account
  };
  boxShipment = {
    packageType: res.boxShipment.packageType,
    quantity: res.boxShipment.quantity,
    weight: res.boxShipment.weight,
    length: res.boxShipment.length,
    width: res.boxShipment.width,
    height: res.boxShipment.height,
    instruction: res.boxShipment.instruction
  };
  envelopeShipment = {
    packageType: res.envelopeShipment.packageType,
    quantity: res.envelopeShipment.quantity,
    instruction: res.envelopeShipment.instruction
  };
  pickupDetails = {
    service: res.pickupDetails.service,
    ready: res.pickupDetails.ready,
    closing: res.pickupDetails.closing,
    department: res.pickupDetails.department,
    point: res.pickupDetails.point
  }
  references = {
    employeeNumber: res.references.employeeNumber,
    invoiceNumber: res.references.invoiceNumber,
    purchaseNumber: res.references.purchaseNumber,
    presoldOrderNumber: res.references.presoldOrderNumber
  };

  additionalServices = {
    holdForPickup: res.additionalServices.holdForPickup,
    nonConveyable: res.additionalServices.nonConveyable,
    privateHomeDelivery: res.additionalServices.privateHomeDelivery,
    signatureRequired: res.additionalServices.signatureRequired,
    tradeShowDelivery: res.additionalServices.tradeShowDelivery,
    weekendDelivery: res.additionalServices.weekendDelivery,
    insurance: res.additionalServices.insurance,
    insuranceValue: res.additionalServices.insuranceValue
  };
}
*/
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
});


describe("Testing Domestic Parcel Shipments", () => {

  for (var i = 0; i < 1; i++) {
    describe("test #" + (i+1) + ".", () => {
      test("test", async () => {
        let noError = true;
        try {
          noError = await Quick.doChangetoQuick();

          noError = await Quick.doAddressDetails(addresses.from, addresses.to);

          noError = await Quick.doPaymentDetails(payment.account, payment.type);

          noError = await Quick.pickupDetails(
            pickupDetails.ready,
            pickupDetails.closing,
            pickupDetails.point,
            pickupDetails.department,
            pickupDetails.service
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
            boxShipment.packageType,
            boxShipment.quantity,
            boxShipment.weight,
            boxShipment.length,
            boxShipment.width,
            boxShipment.height,
            boxShipment.instruction
          );

          noError = await Quick.fillUpEnvelopeForm(
            envelopeShipment.packageType,
            envelopeShipment.quantity,
            envelopeShipment.instruction
          );

          await page.waitFor(2000);
          await page.click(btnShip);
          await page.waitFor(20000);

          expect(noError).toBe(true);
        } catch (err) { console.log(err); fail(err); }
      }, 120000);
    });
  }
});