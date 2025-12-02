const { app, BrowserWindow, Menu } = require('electron');
const path = require('path');
const { spawn } = require('child_process');

let mainWindow;
let serverProcess;
const SERVER_PORT = 3001;

// Enable live reload for development
const isDev = !app.isPackaged;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    backgroundColor: '#0a0a0a',
    icon: path.join(__dirname, 'build', 'icon.png'),
    webPreferences: {
      preload: path.join(__dirname, 'electron-preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    show: true, // Show immediately
    center: true, // Center on screen
    frame: true,
    titleBarStyle: 'default',
    alwaysOnTop: false,
  });

  // Ensure window is focused and visible
  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
    mainWindow.moveTop();
  });

  // Load the app
  if (isDev) {
    // Development mode: load from Vite dev server
    mainWindow.loadURL('http://localhost:5173');
    mainWindow.webContents.openDevTools();
  } else {
    // Production mode: load from built files
    mainWindow.loadFile(path.join(__dirname, 'client', 'dist', 'index.html'));
  }

  // Create application menu
  createMenu();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        {
          label: 'Reload',
          accelerator: 'CmdOrCtrl+R',
          click: () => {
            if (mainWindow) mainWindow.reload();
          },
        },
        { type: 'separator' },
        {
          label: 'Exit',
          accelerator: 'CmdOrCtrl+Q',
          click: () => {
            app.quit();
          },
        },
      ],
    },
    {
      label: 'Edit',
      submenu: [
        { role: 'undo' },
        { role: 'redo' },
        { type: 'separator' },
        { role: 'cut' },
        { role: 'copy' },
        { role: 'paste' },
        { role: 'selectAll' },
      ],
    },
    {
      label: 'View',
      submenu: [
        { role: 'resetZoom' },
        { role: 'zoomIn' },
        { role: 'zoomOut' },
        { type: 'separator' },
        { role: 'togglefullscreen' },
      ],
    },
    {
      label: 'Window',
      submenu: [
        { role: 'minimize' },
        { role: 'close' },
      ],
    },
  ];

  // Add Developer menu in development mode
  if (isDev) {
    template.push({
      label: 'Developer',
      submenu: [
        { role: 'toggleDevTools' },
        { type: 'separator' },
        {
          label: 'Reload',
          accelerator: 'F5',
          click: () => {
            if (mainWindow) mainWindow.reload();
          },
        },
      ],
    });
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

function startBackendServer() {
  return new Promise((resolve, reject) => {
    const serverPath = path.join(__dirname, 'server.js');
    
    // Set environment variables
    const env = {
      ...process.env,
      PORT: SERVER_PORT.toString(),
      NODE_ENV: isDev ? 'development' : 'production',
    };

    // Start the server process
    serverProcess = spawn('node', [serverPath], {
      env,
      cwd: __dirname,
      stdio: 'pipe',
    });

    serverProcess.stdout.on('data', (data) => {
      console.log(`[Backend] ${data.toString().trim()}`);
      
      // Check if server is ready
      if (data.toString().includes('Server running') || data.toString().includes('listening')) {
        resolve();
      }
    });

    serverProcess.stderr.on('data', (data) => {
      console.error(`[Backend Error] ${data.toString().trim()}`);
    });

    serverProcess.on('error', (error) => {
      console.error('[Backend] Failed to start:', error);
      reject(error);
    });

    serverProcess.on('close', (code) => {
      console.log(`[Backend] Process exited with code ${code}`);
    });

    // Resolve after a short delay if no explicit ready message
    setTimeout(() => {
      resolve();
    }, 3000);
  });
}

function stopBackendServer() {
  if (serverProcess) {
    console.log('[Backend] Stopping server...');
    serverProcess.kill();
    serverProcess = null;
  }
}

// App lifecycle events
app.whenReady().then(async () => {
  console.log('[Electron] App is ready');
  
  try {
    // Start backend server first
    console.log('[Electron] Starting backend server...');
    await startBackendServer();
    console.log('[Electron] Backend server started');
    
    // Then create the window
    createWindow();
  } catch (error) {
    console.error('[Electron] Failed to start application:', error);
    app.quit();
  }

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createWindow();
    }
  });
});

app.on('window-all-closed', () => {
  stopBackendServer();
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  stopBackendServer();
});

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
  console.error('[Electron] Uncaught exception:', error);
});

process.on('unhandledRejection', (error) => {
  console.error('[Electron] Unhandled rejection:', error);
});
