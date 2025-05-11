const { app, BrowserWindow } = require('electron');
const path = require('path');

const isDev = process.env.NODE_ENV === 'development';

function createWindow() {
  const win = new BrowserWindow({
    width: 900,
    height: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      webSecurity: false,
    },
  });

  if (isDev) {
    win.loadURL('http://localhost:3000');
  } else {
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', function () {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function () {
  if (process.platform !== 'darwin') app.quit();
});
