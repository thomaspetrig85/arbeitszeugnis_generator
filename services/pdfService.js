const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');
const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png');
const LOGO_EXISTS = fs.existsSync(LOGO_PATH);

const NAVY = '#1E2D4E';
const GRAY = '#666666';
const DARK = '#222222';

function replacePlaceholders(text, data) {
  if (!text) return '';
  return text
    .replace(/\[Anrede\]/g, data.anrede || '')
    .replace(/\[Name\]/g, [data.vorname, data.nachname].filter(Boolean).join(' ') || '')
    .replace(/\[Vorname\]/g, data.vorname || '')
    .replace(/\[Funktion\]/g, data.funktion || '')
    .replace(/\[Pensum\]/g, data.pensum ? data.pensum + ' %' : '')
    .replace(/\[Eintrittsdatum\]/g, data.eintrittsdatum || '')
    .replace(/\[Austrittsdatum\]/g, data.austrittsdatum || '')
    .replace(/\[Praxisname\]/g, 'Therapie Kreuzplatz AG');
}

function getZeugnistypLabel(typ) {
  const labels = {
    qualifiziert: 'ARBEITSZEUGNIS',
    zwischenzeugnis: 'ZWISCHENZEUGNIS',
    bestaetigung: 'ARBEITSBESTÄTIGUNG',
    praktikum: 'PRAKTIKUMSZEUGNIS',
  };
  return labels[typ] || 'ARBEITSZEUGNIS';
}

async function generatePdf(data) {
  return new Promise((resolve, reject) => {
    try {
      // A4: 595.28 x 841.89 pt
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 72, bottom: 60, left: 72, right: 56 },
        info: {
          Title: getZeugnistypLabel(data.zeugnistyp),
          Author: 'Therapie Kreuzplatz AG',
        },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      const pageWidth = doc.page.width;
      const leftMargin = doc.page.margins.left;
      const rightMargin = doc.page.margins.right;
      const contentWidth = pageWidth - leftMargin - rightMargin;
      const titleLabel = getZeugnistypLabel(data.zeugnistyp);

      // ── HEADER ────────────────────────────────────────────────
      // Logo left
      if (LOGO_EXISTS) {
        doc.image(LOGO_PATH, leftMargin, 44, { height: 26, fit: [120, 26] });
      } else {
        doc.font('Helvetica-Bold').fontSize(14).fillColor(NAVY).text('therapie kreuzplatz', leftMargin, 55, { continued: false });
      }

      // Address right
      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(GRAY)
        .text('Kreuzplatz 16 | 8008 Zürich | 044 260 95 95', leftMargin, 58, {
          width: contentWidth,
          align: 'right',
        });

      // Header rule
      const ruleY = 78;
      doc
        .moveTo(leftMargin, ruleY)
        .lineTo(pageWidth - rightMargin, ruleY)
        .lineWidth(1.5)
        .strokeColor(NAVY)
        .stroke();

      // ── TITLE ─────────────────────────────────────────────────
      doc
        .font('Helvetica-Bold')
        .fontSize(16)
        .fillColor(NAVY)
        .text(titleLabel, leftMargin, ruleY + 22, {
          width: contentWidth,
          align: 'center',
          characterSpacing: 2,
        });

      // ── DATE (right-aligned) ───────────────────────────────────
      if (data.ausstellungsdatum) {
        doc
          .font('Helvetica')
          .fontSize(10)
          .fillColor('#444444')
          .text(`Zürich, ${data.ausstellungsdatum}`, leftMargin, ruleY + 52, {
            width: contentWidth,
            align: 'right',
          });
      }

      // ── BODY PARAGRAPHS ───────────────────────────────────────
      const bodyStartY = ruleY + 80;
      doc.y = bodyStartY;

      const bloecke = (data.bloecke || []).filter((b) => b.text && b.text.trim());
      for (const block of bloecke) {
        const resolved = replacePlaceholders(block.text, data);
        doc
          .font('Helvetica')
          .fontSize(11)
          .fillColor(DARK)
          .text(resolved, leftMargin, doc.y, {
            width: contentWidth,
            align: 'justify',
            lineGap: 3,
          });
        doc.moveDown(0.7);
      }

      // ── SIGNATURE BLOCK ───────────────────────────────────────
      // Place signature near bottom, at least 60pt below last paragraph
      const sigY = Math.max(doc.y + 50, doc.page.height - doc.page.margins.bottom - 100);

      doc
        .font('Helvetica-Bold')
        .fontSize(10.5)
        .fillColor(DARK)
        .text('Therapie Kreuzplatz AG', leftMargin, sigY);

      if (data.unterzeichnerName) {
        doc
          .font('Helvetica-Bold')
          .fontSize(10.5)
          .fillColor(DARK)
          .text(data.unterzeichnerName, leftMargin + contentWidth / 2, sigY, {
            width: contentWidth / 2,
            align: 'left',
          });
      }

      if (data.unterzeichnerFunktion) {
        doc
          .font('Helvetica-Oblique')
          .fontSize(10)
          .fillColor(GRAY)
          .text(data.unterzeichnerFunktion, leftMargin + contentWidth / 2, sigY + 16, {
            width: contentWidth / 2,
            align: 'left',
          });
      }

      // ── FOOTER ────────────────────────────────────────────────
      const footerY = doc.page.height - doc.page.margins.bottom - 14;
      doc
        .moveTo(leftMargin, footerY - 6)
        .lineTo(pageWidth - rightMargin, footerY - 6)
        .lineWidth(0.75)
        .strokeColor(NAVY)
        .stroke();

      doc
        .font('Helvetica')
        .fontSize(8)
        .fillColor(GRAY)
        .text('Therapie Kreuzplatz AG', leftMargin, footerY, {
          width: contentWidth,
          align: 'center',
        });

      doc.end();
    } catch (err) {
      reject(err);
    }
  });
}

module.exports = { generatePdf };
