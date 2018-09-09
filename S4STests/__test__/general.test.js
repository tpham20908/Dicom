const faker = require("faker");
const puppeteer = require("puppeteer");

const APP = "https://shipping.dicom.com";
const DEV_API_URL = "https://dicom-dev.cleverbuild.biz/api/v1";

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 50
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});

describe("Signing up", () => {
  /**
   * Pretest
   */
  // test("getting to the signup page", async () => {
  //   await page.goto(APP);
  //   await page.click(".link-sign-up");
  //   expect(page.url()).toEqual("https://shipping.dicom.com/register/#/register/");
  // }, 16000);

  /*******************************************************
   *  Test #1:
   *******************************************************/
  test("Can't sign up with an invalid email (email of: 'testing_bad_email')", async () => {
    await page.goto("https://shipping.dicom.com/register");
    expect(page.url()).toEqual("https://shipping.dicom.com/register");
  }, 16000);
});