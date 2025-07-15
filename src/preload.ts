import { contextBridge, ipcRenderer } from 'electron';

//Exposing context for window actions like minimize, maximize and close
contextBridge.exposeInMainWorld('api', {
  minimize: () => ipcRenderer.send('window-minimize'),
  close: () => ipcRenderer.send('window-close')
});