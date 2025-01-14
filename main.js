const { app, BrowserWindow } = require("electron");
const fs = require("fs");
const Handlebars = require("handlebars");
const yaml = require("js-yaml");
const path = require("path");

const modDir = path.join(app.getPath("documents"), "Paradox Interactive", "Stellaris", "mod");

// Compilation functions

const compileHandlebars = (file, data) => {
   const filePath = path.join(__dirname, "src", "views", file);
   const source = fs.readFileSync(filePath, "utf-8").toString();
   const template = Handlebars.compile(source);
   return template(data);
};

const getLocale = (language) => {
   const localePath = path.join(__dirname, "src", "locale", `${language}.yml`);
   const locale = fs.readFileSync(localePath, "utf-8");
   return yaml.load(locale);
};

// Mod functions

const getModDescriptorNames = () => {
   const mods = fs.readdirSync(modDir);
   return mods.filter((mod) => mod.endsWith(".mod") && !mod.match(/ugc_\d+\.mod/));
};

const getModFolder = (modDescriptorName) => {
   const mod = fs.readFileSync(path.join(modDir, modDescriptorName), "utf-8");
   const modPath = mod.match(/path="(.*)"/)[1];
   return path.join(app.getPath("documents"), "Paradox Interactive", "Stellaris", modPath);
};

const getModName = (modDescriptorName) => {
   const mod = fs.readFileSync(path.join(modDir, modDescriptorName), "utf-8");
   return mod.match(/name="(.*)"/)[1];
};

// Main function

const main = () => {
   const win = new BrowserWindow({
      frame: false,
      fullscreen: true,
      webPreferences: {
         nodeIntegration: true,
         preload: path.join(__dirname, "src", "preload.js"),
      },
   });

   const modFolders = getModDescriptorNames().map((mod) => {
      return {
         descriptor: mod,
         name: getModName(mod),
         folder: getModFolder(mod),
      };
   });

   const data = {
      locale: getLocale("en"),
      mods: modFolders,
   };

   const page = compileHandlebars("index.hbs", data);
   win.loadURL(`data:text/html;charset=utf-8,${encodeURIComponent(page)}`);
};

app.whenReady().then(main);
