const { test, expect, _electron: electron } = require("@playwright/test");

const helpers = require("./helpers/test-helpers");

test("New mod button", async () => {
   const app = await helpers.setup();

   helpers.exists(app, "text=New mod");

   await helpers.teardown(app);
});
