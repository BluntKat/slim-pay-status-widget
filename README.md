# 🛰️ SlimPay Status Widget

A lightweight Electron widget that displays the operational status of SlimPay services, with auto-refresh, countdown, and custom intervals.

---

## ✨ Features

- 🔄 Auto-refreshes SlimPay service status
- 🕒 Choose between 10s, 30s, 60s, or 120s refresh intervals
- 🔴 Visual status indicators (OK, degraded, down)
- 🪟 Custom minimize and close buttons using Electron IPC
- 🖼 Frameless, always-on-top window
- 🧪 Built with TypeScript, Electron, and the SlimPay Status API

---

## 📦 Installation

```bash
git clone https://github.com/your-username/slimpay-status-widget.git
cd slimpay-status-widget
npm install
🧪 Development
To build and run the app locally:

bash

npm run start
Compiles TypeScript and launches the Electron app.

📦 Build for Distribution
bash

npm run build       # Builds the renderer (HTML, CSS, JS)
npm run package     # Packages the app using electron-builder
Output installers will be available in the dist/ folder.

🧱 Project Structure
bash

slimpay-status-widget/
├── src/
│   ├── main.ts          # Electron main process
│   ├── preload.ts       # Secure bridge between renderer and main
│   └── renderer/
│       ├── index.html   # UI layout
│       ├── style.css    # Basic styles
│       └── widget.ts    # Renderer logic (UI + API calls)
├── dist/                # Compiled app
├── package.json
├── tsconfig.json
└── README.md
🛠 Configuration Notes
Make sure your preload.ts is compiled to dist/preload.js

Ensure webPreferences.preload in main.ts is correctly set:

ts

preload: path.join(__dirname, 'preload.js'),
You must expose API safely via contextBridge in preload.ts:

ts

contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close')
});
In your renderer code (widget.ts), use:

ts

window.api.minimize();
window.api.close();
🧠 Troubleshooting
window.api is undefined
→ Ensure preload.js is built and correctly linked in the BrowserWindow config.

SyntaxError: Cannot use import statement outside a module
→ Electron expects CommonJS in preload scripts. Use tsconfig with:

json

{
  "compilerOptions": {
    "module": "ESNext",
    "target": "ES2020",
    "moduleResolution": "Node",
    "outDir": "./dist",
    "esModuleInterop": true
  }
}
Reduce Package Size
→ Use extraFiles, files, and exclude dev dependencies in electron-builder config:

json

"build": {
  "files": [
    "dist/**/*"
  ]
}
📃 License
MIT — Feel free to modify and use this project as you wish.

Made with no ❤️ and a lot off need by -_-
