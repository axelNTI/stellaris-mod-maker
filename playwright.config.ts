import { defineConfig } from "@playwright/test";

export default defineConfig({
   testDir: "./tests/",
   outputDir: "./logs/",
   reporter: [
      ["list"],
      ["json", { outputFile: "logs/results.json" }],
   ],
});
