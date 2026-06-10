const {
  Document,
  Packer,
  Paragraph,
  TextRun,
  ImageRun,
  AlignmentType,
  TabStopType,
  TabStopPosition,
  Header,
  Footer,
  PageSize,
  SectionType,
  HeadingLevel,
  BorderStyle,
  Table,
  TableRow,
  TableCell,
  WidthType,
  TableLayoutType,
} = require('docx');
const fs = require('fs');
const path = require('path');

const LOGO_PATH = path.join(__dirname, '..', 'assets', 'logo.png');
const LOGO_DATA = fs.existsSync(LOGO_PATH) ? fs.readFileSync(LOGO_PATH) : null;

const NAVY = '1E2D4E';
const FONT = 'Calibri';

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

async function generateDocx(data) {
  const bloecke = data.bloecke || [];
  const titleLabel = getZeugnistypLabel(data.zeugnistyp);

  // Header
  const logoChildren = [];
  if (LOGO_DATA) {
    logoChildren.push(
      new ImageRun({
        type: 'png',
        data: LOGO_DATA,
        transformation: { width: 110, height: 29 },
        altText: { title: 'therapie kreuzplatz', description: 'Logo', name: 'Logo' },
      })
    );
    logoChildren.push(new TextRun({ text: '\t' }));
  } else {
    logoChildren.push(new TextRun({ text: 'therapie kreuzplatz', bold: true, color: NAVY, size: 24, font: FONT }));
    logoChildren.push(new TextRun({ text: '\t' }));
  }
  logoChildren.push(new TextRun({ text: 'Kreuzplatz 16 | 8008 Zürich | 044 260 95 95', color: '666666', size: 18, font: FONT }));

  const header = new Header({
    children: [
      new Paragraph({
        children: logoChildren,
        tabStops: [
          {
            type: TabStopType.RIGHT,
            position: TabStopPosition.MAX,
          },
        ],
        border: {
          bottom: {
            color: NAVY,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
        spacing: { after: 200 },
      }),
    ],
  });

  // Footer
  const footer = new Footer({
    children: [
      new Paragraph({
        alignment: AlignmentType.CENTER,
        children: [
          new TextRun({
            text: 'Therapie Kreuzplatz AG',
            color: '666666',
            size: 18,
            font: FONT,
          }),
        ],
        border: {
          top: {
            color: NAVY,
            space: 4,
            style: BorderStyle.SINGLE,
            size: 6,
          },
        },
      }),
    ],
  });

  const children = [];

  // Title
  children.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 400, after: 200 },
      children: [
        new TextRun({
          text: titleLabel,
          bold: true,
          color: NAVY,
          size: 32,
          font: FONT,
        }),
      ],
    })
  );

  // Subtitle: Zürich + date
  if (data.ausstellungsdatum) {
    children.push(
      new Paragraph({
        alignment: AlignmentType.RIGHT,
        spacing: { before: 100, after: 400 },
        children: [
          new TextRun({
            text: `Zürich, ${data.ausstellungsdatum}`,
            size: 22,
            font: FONT,
          }),
        ],
      })
    );
  }

  // Body paragraphs
  for (const block of bloecke) {
    if (!block.text || !block.text.trim()) continue;
    const resolvedText = replacePlaceholders(block.text, data);
    children.push(
      new Paragraph({
        spacing: { before: 200, after: 200 },
        children: [
          new TextRun({
            text: resolvedText,
            size: 22,
            font: FONT,
          }),
        ],
      })
    );
  }

  // Spacer before signature
  children.push(new Paragraph({ spacing: { before: 600, after: 0 }, children: [] }));

  // Signature block
  children.push(
    new Paragraph({
      spacing: { before: 0, after: 200 },
      children: [
        new TextRun({ text: 'Therapie Kreuzplatz AG', size: 22, font: FONT }),
        new TextRun({ text: '\t', size: 22, font: FONT }),
        new TextRun({
          text: data.unterzeichnerName ? `${data.unterzeichnerName}` : '',
          size: 22,
          font: FONT,
        }),
      ],
      tabStops: [
        {
          type: TabStopType.LEFT,
          position: 5000,
        },
      ],
    })
  );

  if (data.unterzeichnerFunktion) {
    children.push(
      new Paragraph({
        spacing: { before: 0, after: 0 },
        children: [
          new TextRun({ text: '', size: 22, font: FONT }),
          new TextRun({ text: '\t', size: 22, font: FONT }),
          new TextRun({
            text: data.unterzeichnerFunktion,
            size: 22,
            font: FONT,
            italics: true,
          }),
        ],
        tabStops: [
          {
            type: TabStopType.LEFT,
            position: 5000,
          },
        ],
      })
    );
  }

  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            size: {
              width: 11906,
              height: 16838,
            },
            margin: {
              top: 2268,
              bottom: 1134,
              left: 1701,
              right: 1134,
            },
          },
        },
        headers: { default: header },
        footers: { default: footer },
        children,
      },
    ],
  });

  return await Packer.toBuffer(doc);
}

module.exports = { generateDocx };
