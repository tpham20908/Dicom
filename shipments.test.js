const faker = require("faker");
const puppeteer = require("puppeteer");

const APP = "https://shipping.dicom.com";

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    // slowMo: 30
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});

describe("Shipments", () => {
  /**
   * Pre-Test #1: To access the shipment page, you have to sign in first!
   */
  test("Login", async () => {
    await page.goto(APP);
    expect(await Shipments.onSignIn(
      "shipping.demo@dicomexpress.com",
      "Dicom-1234"
    )).toBeTruthy();
  }, 16000);

  /**
   * Pre-Test #2: Actually getting to the shipments page
   */
  test("Getting to the shipment page", async () => {
    expect(await Shipments.goToWizard()).toBeTruthy();
  }, 16000);

});

const Shipments = {
  onSignIn: async (email, pass) => {
    await page.click("input[name=email]");
    await page.type("input[name=email]", email, { delay: 15 });
    await page.click("input[name=password]");
    await page.type("input[name=password]", pass, { delay: 15 });
    await page.click(".btn.btn-sign-up");
    await page.waitFor(1000);

    return true;
  },
  goToWizard: async () => {
    await page.hover(".menu-item.active.hover-over.shipping");
    await page.waitForSelector(".sub-route div:nth-child(1)", { timeout: 10000, visible: true });
    await page.click(".sub-route div:nth-child(1)");
    await page.waitForSelector(".top-hat-container", { timeout: 10000, visible: true });
    return !!(await page.$(".top-hat-header"));
  },
};