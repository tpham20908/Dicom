import { _ } from './src/app/modules/Start/controller';
import { SignIn } from './src/app/modules/Signin/helper';
import * as Quick from './src/app/modules/Quick/controller';
import * as Contact from './src/app/modules/Contacts/controller';
import * as Helper from './src/app/modules/Quick/helper';
import { Manifest } from './src/app/modules/Manifests/helper';
import { PAYMENT_TYPES, ACCOUNTS, SERVICE_TYPES, PICKUP_POINTS, PICKUP_TIMES } from './src/app/modules/Shipments/shipment_details';

let page;
let browser;

const USERNAME = "test@test.com";
const PASSWORD = "test123";
// const USERNAME = "tung@dicomexpress.com";
// const PASSWORD = "Dicom-1234";

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
  for (var i = 0; i < 1; i++) {
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
        // path: (DOMESTIC_PATH + "test/")
      };

      // with the shipment can we predict the error if any, so that when running the test
      // below upon return of or within the test itself we can make sure it passes if it is
      // supposed to run in to an error, e.g. ready time is later than closing time.
      // Possible errors: ready time is later than closing time

      test("test", async () => {
        let noError = true;
        try {
          noError = await Quick.doChangetoQuick();

          noError = await Quick.doAddressDetails(shipment);

          noError = await Quick.doPaymentDetails(shipment);
          // noError = await Quick.doPackageType();

          // noError = await Quick.doPackageDetails(shipment);
          // noError = await Quick.doPackageDetailsProceed(false);

          // noError = await Quick.doConfirmPay(shipment);
          // noError = await Quick.doConfirmPayProceed(shipment.path);
          expect(noError).toBe(true);
        } catch (err) { console.log(err); fail(err); }
      }, 40000);
    });
  }
});