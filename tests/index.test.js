const { test, expect, _electron: electron } = require("@playwright/test");

const helpers = require("./helpers/test-helpers");

test("New mod button", async () => {
   const app = await helpers.setup();

   const newModButton = await app.$("text=New mod");

   expect(newModButton).not.toBeNull();
});
