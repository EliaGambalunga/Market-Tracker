import { app, BrowserWindow } from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const mainWindow = new BrowserWindow({
        width: 1400,
        height: 900,
        titleBarStyle: 'hiddenInset', // Makes it look native on a Mac
        backgroundColor: '#0a0e17',
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
        }
    });

    // Use the local Vite dev server if running in dev mode, else load the built index.html
    const startUrl = process.env.ELECTRON_START_URL || `file://${path.join(__dirname, 'dist/index.html')}`;

    mainWindow.loadURL(startUrl);

    // mainWindow.webContents.openDevTools();
}

app.whenReady().then(() => {
    createWindow();

    app.on('activate', () => {
        if (BrowserWindow.getAllWindows().length === 0) {
            createWindow();
        }
    });
});

app.on('window-all-closed', () => {
    if (process.platform !== 'darwin') {
        app.quit();
    }
});
