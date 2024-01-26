"use strict";
const fsp = require("node:fs/promises");
const path = require("node:path");
const electron = require("electron");
const STORAGE_PATH = "E:\\program\\record-your-life";
process.env.DIST = path.join(__dirname, "../dist");
process.env.VITE_PUBLIC = electron.app.isPackaged ? process.env.DIST : path.join(process.env.DIST, "../public");
let win;
const VITE_DEV_SERVER_URL = process.env["VITE_DEV_SERVER_URL"];
function createWindow() {
  win = new electron.BrowserWindow({
    icon: path.join(process.env.VITE_PUBLIC, "electron-vite.svg"),
    width: 900,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js")
    }
  });
  win.webContents.on("did-finish-load", () => {
    win == null ? void 0 : win.webContents.send("main-process-message", (/* @__PURE__ */ new Date()).toLocaleString());
  });
  win.webContents.openDevTools();
  if (VITE_DEV_SERVER_URL) {
    win.loadURL(VITE_DEV_SERVER_URL);
  } else {
    win.loadFile(path.join(process.env.DIST, "index.html"));
  }
}
electron.app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    electron.app.quit();
    win = null;
  }
});
electron.app.on("activate", () => {
  if (electron.BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
electron.app.whenReady().then(() => {
  const DATE_JSON_REGX = /\d{4}-\d{2}-\d{2}.json/;
  electron.ipcMain.handle("all-date", async () => {
    const dates = (await fsp.readdir(STORAGE_PATH)).filter((item) => DATE_JSON_REGX.test(item)).map((item) => item.replace(".json", ""));
    return dates;
  });
  electron.ipcMain.handle("app", async (_e, date) => {
    try {
      const content = await fsp.readFile(
        path.join(STORAGE_PATH, date + ".json"),
        "utf-8"
      );
      const raw = JSON.parse(content);
      const result = [];
      for (const [name, value] of Object.entries(raw)) {
        try {
          if (value.path) {
            const icon = await electron.app.getFileIcon(value.path, {
              size: "large"
            });
            result.push({
              name,
              ...value,
              icon: icon.toDataURL()
            });
          }
        } catch (error) {
        }
      }
      return result.sort((a, b) => b.total - a.total);
    } catch (err) {
      return;
    }
  });
  createWindow();
});
