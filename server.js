const express = require('express');
const cors = require('cors');
const path = require('path');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:3000'] }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API routes
app.use('/api', apiRoutes);

// Serve assets (logo etc.) statically
app.use('/logo.png', express.static(path.join(__dirname, 'assets', 'logo.png')));

// Serve built React app
app.use(express.static(path.join(__dirname, 'client', 'dist')));

// Fallback to React app for all non-API routes
app.get('*', (req, res) => {
  const distPath = path.join(__dirname, 'client', 'dist', 'index.html');
  res.sendFile(distPath, (err) => {
    if (err) {
      res.status(200).send('<html><body><h1>Arbeitszeugnis Generator</h1><p>Bitte zuerst <code>cd client && npm run build</code> ausführen oder im Dev-Modus starten mit <code>npm run dev</code>.</p></body></html>');
    }
  });
});

app.listen(PORT, () => {
  console.log(`Arbeitszeugnis Generator läuft auf http://localhost:${PORT}`);
});
