const { expect, _electron: electron } = require("@playwright/test");

const setup = async () => {
   const electronApp = await electron.launch({ args: ["."] });
   const packaged = await electronApp.evaluate(({ app }) => app.isPackaged);

   expect(packaged, {
      message: "The test is running in a packaged app",
   }).toBe(false);

   return await electronApp.firstWindow();
};

module.exports = {
   setup,
};
