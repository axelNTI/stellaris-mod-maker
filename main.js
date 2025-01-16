const { app, BrowserWindow, ipcMain } = require("electron");
const fs = require("fs");
const path = require("path");

const modDir = path.join(app.getPath("documents"), "Paradox Interactive", "Stellaris", "mod");

const getModDescriptorNames = () => {
   if (!fs.existsSync(modDir)) {
      return [];
   }
   const mods = fs.readdirSync(modDir);
   return mods.filter((mod) => mod.endsWith(".mod") && !mod.match(/ugc_\d+\.mod/));
};

const getModFolder = (modDescriptorName) => {
   if (!fs.existsSync(modDir)) {
      return "";
   }
   const mod = fs.readFileSync(path.join(modDir, modDescriptorName), "utf-8");
   const modPath = mod.match(/path="(.*)"/)[1];
   return path.join(app.getPath("documents"), "Paradox Interactive", "Stellaris", modPath);
};

const getModName = (modDescriptorName) => {
   if (!fs.existsSync(modDir)) {
      return "";
   }
   const mod = fs.readFileSync(path.join(modDir, modDescriptorName), "utf-8");
   return mod.match(/name="(.*)"/)[1];
};

const getLocale = (languageCode) => {
   const localePath = path.join(__dirname, "out", "locale", `${languageCode}.json`);
   const locale = fs.readFileSync(localePath, "utf-8");
   return JSON.parse(locale);
};

const main = () => {
   const appWindow = new BrowserWindow({
      frame: false,
      fullscreen: true,
      webPreferences: {
         preload: path.join(__dirname, "out", "preload.js"),
      },
   });

   appWindow.loadFile(path.join(__dirname, "out", "html", "en", "index.html"));

   ipcMain.handle("getModDescriptorNames", () => getModDescriptorNames());
   ipcMain.handle("getModFolder", (_, modDescriptorName) => getModFolder(modDescriptorName));
   ipcMain.handle("getModName", (_, modDescriptorName) => getModName(modDescriptorName));
   ipcMain.handle("getLocale", (_, languageCode) => getLocale(languageCode));
};

app.whenReady().then(main);
