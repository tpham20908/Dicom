import { _ } from './src/app/modules/Start/controller';
import { SignIn } from './src/app/modules/Signin/helper';
import * as Quick from './src/app/modules/Quick/controller';
import * as Contact from './src/app/modules/Contacts/controller';
import * as Helper from './src/app/modules/Quick/helper';
import { Manifest } from './src/app/modules/Manifests/helper';
import { PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES } from './src/app/modules/Shipments/shipment_details';

let page;
let browser;

// const USERNAME = "test@test.com";
// const PASSWORD = "test123";
const USERNAME = "test2@email.com";
const PASSWORD = "123456";

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
  for (var i = 0; i < 5; i++) {
    describe("test #" + i + ".", () => {
      let shipment = {
        from: "Dicom Shipping Test",
        to: "CAM-TRAC",    //"dsopinfn",
        payment: PAYMENT_TYPES.prepaid,
        account: ACCOUNTS.ca_parcel,
        service: SERVICE_TYPES.ground,
        ready: PICKUP_TIMES.eight,
        closing: PICKUP_TIMES.four_thirty,
        point: PICKUP_POINTS.mailbox,
      };

      test("test", async () => {
        let noError = true;
        try {
          noError = await Quick.doChangetoQuick();

          noError = await Quick.doAddressDetails(shipment.from, shipment.to);

          noError = await Quick.doPaymentDetails(shipment.account, shipment.payment);

          noError = await Quick.fillUpReferences("5", "3", "4", "2");

          // additionalServices(hold_for_pickup, non_conveyable, private_home_delivery, signature_required, trade_show_delivery, weekend_delivery, insurance, insurance_value)
          // noError = await Quick.additionalServices(true, true, true, true, false, false, true, "500");

          noError = await Quick.fillUpBoxForm("BX", "3", "12", "2", "3", "5", "handle with care", "15:30", "22:00", "MB", "Finance", "GRD", "6", "7", "8", "9");

          noError = await Quick.fillUpEnvelopeForm("EV", "5", "keep dry", "16:00", "22:00", "SH", "Logistic", "GRD");

          await page.waitFor(2000);
          await page.click(".quick-shipment-ship-button");

          expect(noError).toBe(true);
        } catch (err) { console.log(err); fail(err); }
      }, 120000);
    });
  }
});