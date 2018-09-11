const faker = require("faker");
const puppeteer = require("puppeteer");

const APP = "https://shipping.dicom.com";

let browser;
let page;

beforeAll(async () => {
  browser = await puppeteer.launch({
    headless: false,
    slowMo: 30
  });
  page = await browser.newPage();
});

afterAll(() => {
  browser.close();
});

describe("Contacts", () => {
  /**
   * Pre-Test #1: To access the contacts page, you have to sign in first!
   */
  test("Login", async () => {
    await page.goto(APP);
    expect(await Contacts.onSignIn(
      "shipping.demo@dicomexpress.com",
      "Dicom-1234"
    )).toBeTruthy();
  }, 16000);

  /**
   * Pre-Test #2: Actually getting to the contacts page
   */
  test("Getting to the contacts page", async () => {
    expect(await Contacts.GoToContacts()).toBeTruthy();
  }, 16000);

  /**
   * Test #1: Creating a contact with an invalid address
   */
  test("Creating a contact with an invalid address", async () => {
    expect(await Contacts.onCreateContact(
      "dummyID", // customerID 
      "884706", // billingAccount
      faker.company.companyName(), // company
      "CA", // country
      "H3S1K8", //postalCode
      faker.address.streetAddress(), // address
      "", // addressLine2
      faker.address.city(), // city
      faker.address.state(), // province
      `${faker.name.firstName()} ${faker.name.firstName()}`, // attentionTo
      faker.phone.phoneNumber(), // phone
      "",  // phoneExt
      faker.internet.email(), // email
      faker.phone.phoneNumber(), // mobilePhone
      false // wantsSameCompanyName
    )).toBeFalsy();
  }, 60000);

  /**
   * Test #2: Creating a contact with a blank address
   */

   /**
    * Test #3: Creating a contact with a blank company name
    */
})

const Contacts = {
  onSignIn: async (email, pass) => {
    await page.click("input[name=email]");
    await page.type("input[name=email]", email, { delay: 15 });
    await page.click("input[name=password]");
    await page.type("input[name=password]", pass, { delay: 15 });
    await page.click(".btn.btn-sign-up");
    await page.waitFor(1000);

    return true;
  },

  GoToContacts: async () => {
    await page.hover(".menu-item.hover-over.manage");
    await page.waitForSelector(".sub-route div:nth-child(1)", { timeout: 10000, visible: true });
    await page.click(".sub-route div:nth-child(1)");
    await page.waitForSelector(".manage-contacts-header", { timeout: 10000, visible: true });
    return !!(await page.$(".manage-contacts-header"));
  },

  onCreateContact: async (
    customerID,
    billingAccount,
    company,
    country,
    postalCode,
    address,
    addressLine2,
    city,
    province,
    attentionTo,
    phone,
    phoneExt,
    email,
    mobilePhone,
    wantsSameCompanyName) => {
    // click the "+ create contact" button
    await page.click(".dicon-add-new");
    await page.waitFor(500);

    // enter the customer ID
    await page.click("input[name=customer_id]");
    await page.type("input[name=customer_id]", customerID);

    // enter the customer's billing account
    await page.click("input[name=billing_account]");
    await page.type("input[name=billing_account]", billingAccount);

    // enter the company name
    await page.click("input[name=company_name]");
    await page.type("input[name=company_name]", company);

    // enter the country
    await changeSelect("country", country);

    // enter the postal code / zip code
    var match = postalCode.length == 6 ? postalCode.replace(/\W/g, '').replace(/(...)/, '$1 ') : null;
    await changeInput("input[name=postal_code]", postalCode, match);

    // enter main street address
    var exists = !!(await page.$("div.address-field.form-group.std.has-error > input"));
    exists ? await changeInput("div.address-field.form-group.std.has-error > input", address) :
      await changeInput("div.address-field.form-group.std > input", address);

    // wait for the auto-complete window to show
    // assume that if no popup window shows after 3 seconds, it's an invalid address
    // after the timeout exceeded, puppeteer will throw an error, so it is needed in a try catch
    try {
      await page.waitFor(".auto-address-item div:nth-child(1)", { timeout: 3000 });
    } catch (e) {
      // the timeout was exceeded, no popup window here
    } finally {
      // this code runs whether the autocomplete showed or not
      // determine if it did show up...
      var autoCompleteWidnowExists = !!(await page.$(".auto-address-item div:nth-child(1)"));

      if (autoCompleteWidnowExists) {
        await page.click(".auto-address-item div:nth-child(1)");
      } else {
        // when the auto complete window didn't show up, type in the city manually
        await changeInput("input[name=city]", city);
      }

      // enter street address line #2
      await changeInput("input[name=street_line_2]", addressLine2);

      // enter "Attention To"
      await changeInput("input[name=person_full_name]", attentionTo);

      // enter phone
      await changeInput("input[name=phone]", phone, formatPhoneNumber(phone));

      // enter phone extension
      await changeInput("input[name=phone_ext]", phoneExt);

      // enter email
      await changeInput("input[name=email]", email);

      // enter mobile phone
      await changeInput("input[name=mobile_phone]", mobilePhone, formatPhoneNumber(mobilePhone));

      // click the "Add Contact" button
      await page.waitFor(100);
      await page.click(".btn.btn-md.btn-secondary.inline.floating");
      await page.waitFor(100);

      // if an error occured and was caught on the clientside, a red box appears around the textbox
      var textboxErrorExists = !!(await page.$(".help-block"));
      return !textboxErrorExists;
    }
  }
};

async function changeInput(name, value, match = null) {
  match = match === null ? value : match;
  let ready = false;
  while (!ready) {
    await page.click(name);
    await page.$eval(name, (element) => {
      element.value = "";
    });
    await page.type(name, value);

    ready = (await page.$eval(name, (element) => {
      return element.value;
    })) === match;
  }
};

async function changeSelect(name, value) {
  let ready = false;
  while (!ready) {
    await page.select("select[name=" + name + "]", value);
    ready = (await page.$eval("select[name=" + name + "]", (element) => {
      var selected = element.options[element.selectedIndex];
      return selected.getAttribute("value");
    })) === value;
  }
};