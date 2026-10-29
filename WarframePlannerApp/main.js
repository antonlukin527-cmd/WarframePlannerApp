const { app, BrowserWindow, protocol } = require('electron');
const path = require('path');
const fs = require('fs');
const url = require('url');

function createWindow() {
  const win = new BrowserWindow({
  // ...
  webPreferences: {
    contextIsolation: true,
    nodeIntegration: false,
    webSecurity: false // 
  }
});
   
  win.loadFile('builds.html');
}

app.whenReady().then(() => {
  // Перехватываем загрузку файлов
  protocol.handle('file', async (request) => {
    const filePath = url.fileURLToPath(request.url);
    const fileName = path.basename(filePath);

    const externalFiles = [
      'data.js', 
      'meta_builds.js', 
      'presets.js', 
      'primary_data.js', 
      'secondary_data.js', 
      'melee_data.js', 
      'warframes_data.js', 
      'mods_data.js', 
      'pets_data.js', 
      'sentinels_data.js',
      'sentinelweapons_data.js'
    ];

    // 1. Пытаемся найти файл снаружи (рядом с .exe)
    if (externalFiles.includes(fileName)) {
      const externalPath = path.join(path.dirname(app.getPath('exe')), fileName);
      
      if (fs.existsSync(externalPath)) {
        try {
          const data = fs.readFileSync(externalPath);
          return new Response(data, { headers: { 'content-type': 'application/javascript' } });
        } catch (e) {
          console.error('Ошибка чтения внешнего файла:', e);
        }
      }
    }

    // 2. Если снаружи нет, берем файл изнутри приложения
    try {
      const data = fs.readFileSync(filePath);
      let contentType = 'text/plain';
      if (fileName.endsWith('.html')) contentType = 'text/html';
      else if (fileName.endsWith('.js')) contentType = 'application/javascript';
      else if (fileName.endsWith('.css')) contentType = 'text/css';
      else if (fileName.endsWith('.png') || fileName.endsWith('.jpg') || fileName.endsWith('.ico')) {
        contentType = 'image/' + fileName.split('.').pop();
      }

      return new Response(data, { headers: { 'content-type': contentType } });
    } catch (e) {
      return new Response('Файл не найден', { status: 404 });
    }
  });

  createWindow();
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});