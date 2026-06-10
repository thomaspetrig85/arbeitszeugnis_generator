const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const docxService = require('../services/docxService');
const pdfService = require('../services/pdfService');

// GET /api/textbausteine
router.get('/textbausteine', (req, res) => {
  try {
    const filePath = path.join(__dirname, '..', 'data', 'textbausteine.json');
    const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    res.json(data);
  } catch (err) {
    console.error('Error reading textbausteine:', err);
    res.status(500).json({ error: 'Fehler beim Laden der Textbausteine' });
  }
});

// POST /api/export/docx
router.post('/export/docx', async (req, res) => {
  try {
    const buffer = await docxService.generateDocx(req.body);
    const vorname = req.body.vorname || 'Zeugnis';
    const nachname = req.body.nachname || '';
    const filename = `Arbeitszeugnis_${nachname}_${vorname}.docx`.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Error generating DOCX:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des DOCX: ' + err.message });
  }
});

// POST /api/export/pdf
router.post('/export/pdf', async (req, res) => {
  try {
    const buffer = await pdfService.generatePdf(req.body);
    const vorname = req.body.vorname || 'Zeugnis';
    const nachname = req.body.nachname || '';
    const filename = `Arbeitszeugnis_${nachname}_${vorname}.pdf`.replace(/\s+/g, '_');
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    res.send(buffer);
  } catch (err) {
    console.error('Error generating PDF:', err);
    res.status(500).json({ error: 'Fehler beim Erstellen des PDF: ' + err.message });
  }
});

// ── ARCHIVE ──────────────────────────────────────────────────────────────────

const ARCHIVE_PATH = path.join(__dirname, '..', 'data', 'archive.json');

function readArchive() {
  try { return JSON.parse(fs.readFileSync(ARCHIVE_PATH, 'utf-8')); }
  catch { return []; }
}
function writeArchive(data) {
  fs.writeFileSync(ARCHIVE_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

// GET /api/archive
router.get('/archive', (req, res) => {
  res.json(readArchive().sort((a, b) => new Date(b.savedAt) - new Date(a.savedAt)));
});

// POST /api/archive  — save a new entry (or upsert by id)
router.post('/archive', (req, res) => {
  const archive = readArchive();
  const { id, formData, bloecke } = req.body;
  const now = new Date().toISOString();
  if (id) {
    const idx = archive.findIndex(e => e.id === id);
    if (idx !== -1) {
      archive[idx] = { ...archive[idx], formData, bloecke, updatedAt: now };
      writeArchive(archive);
      return res.json(archive[idx]);
    }
  }
  const entry = {
    id: Date.now().toString(),
    savedAt: now,
    updatedAt: now,
    formData,
    bloecke,
  };
  archive.unshift(entry);
  writeArchive(archive);
  res.status(201).json(entry);
});

// GET /api/archive/:id
router.get('/archive/:id', (req, res) => {
  const entry = readArchive().find(e => e.id === req.params.id);
  if (!entry) return res.status(404).json({ error: 'Nicht gefunden' });
  res.json(entry);
});

// DELETE /api/archive/:id
router.delete('/archive/:id', (req, res) => {
  const archive = readArchive().filter(e => e.id !== req.params.id);
  writeArchive(archive);
  res.json({ ok: true });
});

module.exports = router;
