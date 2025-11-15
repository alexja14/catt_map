# Mappa Interattiva Università Cattolica Milano

Una mappa interattiva realizzata con React e Leaflet per visualizzare edifici e punti di interesse dell'Università Cattolica di Milano, con ricerca intelligente AI-powered usando Groq.

## Features

- 🗺️ Mappa interattiva con OpenStreetMap/CartoDB
- 📍 Marker personalizzati per edifici e punti di interesse
- 🤖 **Ricerca AI intelligente con Groq** (linguaggio naturale)
- 🔍 Filtri per categoria (Aule, Mense, Biblioteche)
- 📱 Design responsive e futuristico
- ℹ️ Popup informativi dettagliati per ogni location
- 🎯 Zoom fisso ottimizzato per il campus
- 🛣️ Visualizzazione strade e blocchi edifici

## Ricerca AI Esempi

- "biblioteca vicino entrata"
- "dove mangiare"
- "aula informatica"
- "posto per studiare"
- "laboratorio scientifico"

## Setup

1. Clona il repository:
```bash
git clone https://github.com/alexja14/catt_map.git
cd catt_map
```

2. Installa le dipendenze:
```bash
npm install
```

3. Configura le API keys:
```bash
cp .env.example .env
# Modifica .env e inserisci la tua Groq API key
```

4. Avvia l'app:
```bash
npm start
```

L'applicazione sarà disponibile su http://localhost:3000

## Tecnologie

- React 18
- React Leaflet
- Leaflet
- CartoDB (tiles map)
- Groq AI (ricerca intelligente)
- CSS3 (Glassmorphism design)

## Struttura Progetto

- **10 Aule** complete con servizi e orari
- **5 Mense** (inclusa Sky Terrace panoramica)
- **2 Biblioteche** specializzate
- **Strade del campus** con differenziazione principale/secondaria/pedonale
- **Blocchi edifici** colorati per tipologia

## Sviluppo

```bash
npm run build  # Build per produzione
npm test       # Esegui i test
```

## License

MIT
