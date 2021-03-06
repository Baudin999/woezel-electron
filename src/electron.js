const { app, BrowserWindow } = require('electron');
const path = require('path');
const chokidar = require("chokidar");

// Keep a global reference of the window object, if you don't, the window will
// be closed automatically when the JavaScript object is garbage collected.
let mainWindow;

function createWindow() {
    let watcher;
    const mode = process.env.NODE_ENV.trim();

    mainWindow = new BrowserWindow({
        width: 1900,
        height: 1200,
        worldSafeExecuteJavaScript: true,
        autoHideMenuBar: true
    });

    mainWindow.loadURL(`file://${path.join(__dirname, '../public/index.html')}`);
    mainWindow.webContents.openDevTools();
    mainWindow.on('closed', () => {
        mainWindow = null;
        if (watcher) {
            watcher.close();
        }
    });

    // Here we deal with changed files in DEV situations.
    let wait;
    if (mode === 'development') {
        watcher = chokidar.watch(path.join(__dirname, '../public/**/*'), { ignoreInitial: true });
        watcher.on('all', () => {
            if (wait) {
                clearTimeout(wait);
            }
            wait = setTimeout(() => {
                mainWindow.reload();
                wait = null;
            }, 1000);
        });
    }

}

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on('ready', createWindow);

// Quit when all windows are closed.
app.on('window-all-closed', () => {
    // On macOS it is common for applications and their menu bar
    // to stay active until the user quits explicitly with Cmd + Q
    if (process.platform !== 'darwin') {
        app.quit();
    }
});

app.on('activate', () => {
    // On macOS it's common to re-create a window in the app when the
    // dock icon is clicked and there are no other windows open.
    if (mainWindow === null) {
        createWindow();
    }
});