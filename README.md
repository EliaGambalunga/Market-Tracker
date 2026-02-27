# 📈 Market Tracker Elite

**Market Tracker Elite** è una piattaforma professionale all'avanguardia per il monitoraggio in tempo reale dei mercati finanziari. Costruita per offrire un'esperienza utente fluida e Premium, fonde un design *Glassmorphism* ultramoderno con performance ingegneristiche di altissimo livello.

---

## 🔥 Caratteristiche Principali

- **🚀 Performance Estreme**: Motore di rendering ottimizzato in **React** (tramite `useMemo` e `React.memo`) capace di gestire e renderizzare oltre **1500 strumenti finanziari** simultaneamente.
- **⏱️ Dati in Tempo Reale**: Aggiornamenti WebSocket-style con tick rate personalizzabile a **3, 5 o 7 secondi**.
- **📊 Mercati Globali Integrati**: Categorie multiple che includono **Cryptovalute, Azioni (AAPL, TSLA...), Forex, Materie Prime e Metalli Preziosi**.
- **🔔 Sistema di Notifiche Smart**: Imposta alert di prezzo dinamici personalizzati. Ricevi popup Toast animati (e uno storico nell'app) non appena i tuoi asset incrociano le soglie desiderate.
- **📱 Design UI/UX "Sleek Dark Mode"**: Un'interfaccia a schermo intero visivamente sbalorditiva, con sfocature dinamiche, ombre vettoriali e icone personalizzate in base alla categoria dell'asset.
- **⚡ Applicazioni Desktop Native**: Porting completo con **Electron.js**. Disponibile sia per macOS (`.dmg`) che per Windows (`.exe`).

## 🛠️ Stack Tecnologico
- **Frontend**: React 19, Vite, Lucide-React per l'iconografia.
- **Styling**: Vanilla CSS avanzato (Gradienti dinamici, Backdrop-filter, Animazioni CSS3).
- **Desktop Packaging**: Electron, Electron-Builder.
- **Architettura**: Hooks React custom (`useRealtimeData`), LocalStorage per persistenza e ottimizzazione del DOM Virtuale.

## 📥 Installazione e Sviluppo

```bash
# 1. Clona la repository
git clone https://github.com/TUONOME/market-tracker.git

# 2. Entra nella cartella e installa le dipendenze
cd market-tracker
npm install

# 3. Avvia il server di sviluppo locale
npm run dev
```

### O crea le App Desktop
```bash
# Per creare la versione per Mac (.dmg)
npm run electron:build:mac

# Per creare la versione per Windows (.exe)
npm run electron:build:win
```

---
*Progettato, codificato e firmato da **Elia Gambalunga**.*
