const faker = require("faker");
const puppeteer = require("puppeteer");

const APP = "https://shipping.dicom.com";

let browser;
let page;

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: false,
		// slowMo: 60
	});
	page = await browser.newPage();
});

afterAll(() => {
	browser.close();
});

describe("Signin", () => {
  /**
   * Test #1: Signing in with an invalid email 
   */
  test("Signing in with an invalid email", async () => {
    await page.goto(APP);
    expect(await Test.onSignIn(
      faker.internet.email(),
      faker.internet.password()
    )).toBeFalsy();
  }, 600000);

  /**
   * Test #2: Signing in with an invalid password
   */
  test("Signing in with an invalid password", async () => {
    expect(await Test.onSignIn(
      "shipping.demo@dicomexpress.com",
      faker.internet.password()
    )).toBeFalsy();
  }, 600000);

  /**
   * Test #3: Signing in with a blank password
   */
  test("Signing in with a blank password", async () => {
    expect(await Test.onSignIn(
      "shipping.demo@dicomexpress.com",
      ""
    )).toBeFalsy();
  }, 600000);

  /**
   * Test #4: Signing in with a blank email
   */
  test("Signing in with a blank email", async () => {
    expect(await Test.onSignIn(
      "",
      faker.internet.password()
    )).toBeFalsy();
  }, 600000);

  /**
   * Test #5: Signing in with valid credentials
   */
  test("Signing in with valid credentials", async () => {
    expect(await Test.onSignIn(
      "shipping.demo@dicomexpress.com",
      "Dicom-1234"
    )).toBeTruthy();
  }, 600000);

  /**
   * Test #6: Logout -- Test #5 must run first
   */
  test("Logout", async () => {
    expect(await Test.onLogout()).toBeTruthy();
  }, 600000);
});

const Test = {
  onSignIn: async (email, pass) => {
    await page.click("input[name=email]");
    await ClearUsername();
    await page.type("input[name=email]", email, { delay: 15 });
    await page.click("input[name=password]");
    await ClearPassword();
    await page.type("input[name=password]", pass, { delay: 15 });
    await page.click(".btn.btn-sign-up");
    await page.waitFor(1000);

    return !!(await page.$('.side-bar'));
  },
  onLogout: async () => {
    await page.waitForSelector(".nav-profile-options");
    await page.click(".nav-profile-options");
    await page.waitForSelector(".nav-menu-items .header-logout");
    await page.click(".nav-menu-items .header-logout");
    await page.waitFor(300);

    return !(await page.$('.side-bar'));
  }
};

/**
 * Private Functions
 */
async function ClearUsername(){
	await page.evaluate(function() {
		document.querySelector('input[name=email]').value = "";
	});
}
async function ClearPassword(){
	await page.evaluate(function() {
		document.querySelector('input[name=password]').value = "";
	});
}