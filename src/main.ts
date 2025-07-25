import { app, BrowserWindow, ipcMain } from 'electron';
import * as path from 'path';
import { fileURLToPath } from 'url';

// 👇 Re-create __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


let mainWindow: BrowserWindow | null = null;

function createWindow() {
  console.log(path.join(__dirname, 'preload.js'));
  mainWindow = new BrowserWindow({
    width: 480,
    height: 720,
    resizable: true,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    useContentSize : true,
    hasShadow: true,
    backgroundColor: '#00000000',
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'), // Optional
      contextIsolation: true,
      nodeIntegration: false,
    }
  });
  console.log(path.join(__dirname, 'renderer/index.html'));
  mainWindow.loadFile(path.join(__dirname, 'renderer/index.html'));
  //Decomment the next line for Dev Tools :) Hope u don't need that, too idiot, ctrl shift i is fine ahahah
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});

//ACTION BUTTONS EVENT LISTENER

 ipcMain.on('window-minimize', () => {
   mainWindow?.minimize();
 });

 ipcMain.on('window-close', () => {
   mainWindow?.close();
 });