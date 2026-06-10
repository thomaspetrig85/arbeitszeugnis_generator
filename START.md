# Arbeitszeugnis Generator – Therapie Kreuzplatz AG

## Erstmalige Installation (einmalig)

1. Node.js installieren: https://nodejs.org (Version 18+)
2. Terminal öffnen im Ordner `arbeitszeugnis-generator`
3. Backend-Abhängigkeiten installieren:
   ```
   npm install
   ```
4. Frontend bauen:
   ```
   cd client && npm install && npm run build && cd ..
   ```

## App starten

```
node server.js
```

Dann im Browser öffnen: http://localhost:3000

## Entwicklungsmodus (mit Hot Reload)

```
npm run dev
```

App im Browser: http://localhost:5173

## Hinweise

- Die App läuft vollständig lokal – keine Daten verlassen das Netzwerk
- Textbausteine befinden sich in: `data/textbausteine.json`
- Port kann via Umgebungsvariable geändert werden: `PORT=8080 node server.js`

## Verzeichnisstruktur

```
arbeitszeugnis-generator/
├── server.js              # Express Backend
├── package.json           # Backend-Abhängigkeiten
├── routes/
│   └── api.js             # API-Endpunkte
├── services/
│   ├── docxService.js     # DOCX-Generierung
│   └── pdfService.js      # PDF-Generierung
├── data/
│   └── textbausteine.json # Alle Textbausteine (editierbar)
└── client/                # React Frontend
    ├── index.html
    ├── vite.config.js
    ├── package.json
    └── src/
        ├── main.jsx
        ├── App.jsx
        ├── context/
        │   └── ZeugnisContext.jsx
        ├── components/
        │   ├── Layout.jsx
        │   ├── Stepper.jsx
        │   ├── Step1_Stammdaten.jsx
        │   ├── Step2_Bewertung.jsx
        │   ├── Step3_Vorschau.jsx
        │   └── Step4_Export.jsx
        └── utils/
            └── helpers.js
```
