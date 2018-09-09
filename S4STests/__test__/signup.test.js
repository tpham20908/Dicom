import { _ } from '../src/app/modules/Start/controller';
import * as SignUp from '../src/app/modules/Signup/controller';
const faker = require("faker");
const puppeteer = require("puppeteer");

const APP = "https://shipping.dicom.com/register#register";
// const DEV_API_URL = "https://dicom-dev.cleverbuild.biz/api/v1";

let browser;
let page;

beforeAll(async () => {
	browser = await puppeteer.launch({
		headless: false,
		slowMo: 80
	});
	page = await browser.newPage();
	
});

afterAll(() => {
	browser.close();
});

describe("Signing Up", () => {
	test("Can't sign up with an invalid email (email of: 'testing_bad_email')", async () => {
		await page.goto(APP);
		expect(await Tests.onSignUp(page, "testing_bad_email", true, faker.company.companyName(), faker.name.firstName(), faker.name.lastName(), "qwerty", "qwerty", "May", "2", "English")).toBe(false);
	}, 160000);
});

const Tests = {
	onSignUp: async (page, email, newCompany, companyName, firstName, lastName, password, confirmPassword, birthdayMonth, birthdayDay, language) => {
		// enter email
		await page.click("input[name=email]");
		await page.type("input[name=email]", email);

		// check the "is this a new company?"
		// enter copmpany name
		if (newCompany) {
			// await page.click(".checkbox-custom");
			await page.click(".checkbox-label");
			await page.waitFor(50);
			await page.type("input[name=company]", companyName);
		} else {
			await page.type("input[name=code]", companyName);
		}

		// enter first and last names
		await page.click("input[name=first_name]");
		await page.type("input[name=first_name]", firstName);
		await page.click("input[name=last_name]");
		await page.type("input[name=last_name]", lastName);

		// enter passwords (both password and confirm password)
		await page.click("input[name=password]");
		await page.type("input[name=password]", password);
		await page.click("input[name=passwordConfirm]");
		await page.type("input[name=passwordConfirm]", confirmPassword);

		// focus on the next thing to enter to prevent bugs
		await page.focus("select[name='birthdayMonth']");

		// enter birthday and language preferences
		if (birthdayMonth !== "") {
			await page.select("select[name='birthdayMonth']", birthdayMonth);
		}

		if (birthdayDay !== "") {
			await page.select("select[name='birthdayDay']", birthdayDay);
		}

		if (language !== "") {
			await page.select("select[name='lang']", language);
		}

		// click the sign up button
		await page.click(".btn.btn-sign-up");

		// TODO: better error catching
		// check to see if any error exists and store the value for the return
		var textBoxErrorExists = !!(await page.$('.help-block'));
		var didSignUp;

		if (textBoxErrorExists) {
			didSignUp = false;

			// a local error means that no redirect happened
			// refresh to clear the textboxes
			await page.reload();
		} else {
			// if we made it here, the user has been re-directed to a loading screen
			// wait for the program to finish loading and a message to pop up before continuing
			childElements = [undefined];
			while (typeof childElements[0] == "undefined") {
				var childElements = await page.evaluate(() => {
					const tds = Array.from(document.querySelectorAll('.toastr-middle-container'))
					return tds.map(td => td.textContent)
				});

				// add a waitFor so this loop doesn't get run too many times
				await page.waitFor(100);
			}

			var popupMessage = childElements[0];
			didSignUp = popupMessage.startsWith("Success");

			// clear the popup
			await page.waitFor(300);
			await page.click(".toastr-middle-container");
			await page.waitFor(300);

			// they got re-directed to the home page again
			// click the sign up button
			await page.click(".link-sign-up");

			// since the old fields will still be there, invoke a refresh
			await page.reload();
		}

		// return the result
		return didSignUp;
	}
};