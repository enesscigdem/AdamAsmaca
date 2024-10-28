const path = require('path');

module.exports = {
  entry: './app.js',  // Giriş dosyanız
  output: {
    path: path.resolve(__dirname, 'public'),  // Çıkış dizini olarak 'public' ayarlayın
    filename: 'bundle.js'
  }
};
