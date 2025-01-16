const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("backend", {
   getModDescriptorNames: () => ipcRenderer.invoke("getModDescriptorNames"),
   getModFolder: (modDescriptorName) => ipcRenderer.invoke("getModFolder", modDescriptorName),
   getModName: (modDescriptorName) => ipcRenderer.invoke("getModName", modDescriptorName),
   getLocale: (languageCode) => ipcRenderer.invoke("getLocale", languageCode),
   getModFolderNameFromModName: (modName) => ipcRenderer.invoke("getModFolderNameFromModName", modName),
   getModShorthandName: (modName) => ipcRenderer.invoke("getModShorthandName", modName),
});