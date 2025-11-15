import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, Polygon, useMap } from 'react-leaflet';
import L from 'leaflet';
import Groq from 'groq-sdk';
import 'leaflet/dist/leaflet.css';
import './App.css';

// Configura Groq
const groq = new Groq({
  apiKey: process.env.REACT_APP_GROQ_API_KEY,
  dangerouslyAllowBrowser: true
});

// Fix per le icone di Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

// Coordinate centro campus Cattolica Milano
const CENTER = [45.4642, 9.1900];

// Edifici con coordinate precise
const edifici = [
  {
    id: 1,
    nome: 'Ingresso Principale',
    coordinate: [45.46470, 9.18980],
    tipo: 'ingresso',
    descrizione: 'Ingresso principale su Largo Gemelli',
    orari: '7:00 - 22:00',
    servizi: ['Portineria', 'Info Point', 'Accoglienza'],
    icon: '🏛️',
    color: '#A51C30'
  },
  {
    id: 2,
    nome: 'Aula Magna',
    coordinate: [45.46450, 9.19050],
    tipo: 'aula',
    descrizione: 'Aula magna per eventi e conferenze',
    capacita: '500 posti',
    servizi: ['Wi-Fi', 'Proiettore', 'Audio'],
    icon: '🎭',
    color: '#4ECDC4'
  },
  {
    id: 3,
    nome: 'Aula Informatica',
    coordinate: [45.46420, 9.19000],
    tipo: 'aula',
    descrizione: 'Laboratorio con 50 postazioni PC',
    orari: '8:00 - 20:00',
    servizi: ['PC', 'Wi-Fi', 'Stampanti'],
    icon: '💻',
    color: '#4ECDC4'
  },
  {
    id: 4,
    nome: 'Aula Linguistica',
    coordinate: [45.46400, 9.19100],
    tipo: 'aula',
    descrizione: 'Aula per corsi di lingue straniere',
    capacita: '30 posti',
    servizi: ['Cuffie', 'Monitor', 'Wi-Fi'],
    icon: '🗣️',
    color: '#4ECDC4'
  },
  {
    id: 5,
    nome: 'Lab Scientifico',
    coordinate: [45.46380, 9.18950],
    tipo: 'aula',
    descrizione: 'Laboratorio di chimica e biologia',
    orari: '9:00 - 18:00',
    servizi: ['Attrezzatura', 'Sicurezza', 'Supervisione'],
    icon: '🔬',
    color: '#4ECDC4'
  },
  {
    id: 6,
    nome: 'Aula Giurisprudenza',
    coordinate: [45.46500, 9.19080],
    tipo: 'aula',
    descrizione: 'Aula per facoltà di Giurisprudenza',
    capacita: '100 posti',
    servizi: ['Wi-Fi', 'Proiettore'],
    icon: '⚖️',
    color: '#4ECDC4'
  },
  {
    id: 7,
    nome: 'Aula Economia',
    coordinate: [45.46480, 9.18920],
    tipo: 'aula',
    descrizione: 'Aula per facoltà di Economia',
    capacita: '80 posti',
    servizi: ['Wi-Fi', 'Lavagna', 'Proiettore'],
    icon: '📊',
    color: '#4ECDC4'
  },
  {
    id: 8,
    nome: 'Aula Lettere',
    coordinate: [45.46360, 9.19050],
    tipo: 'aula',
    descrizione: 'Aula per facoltà di Lettere',
    capacita: '60 posti',
    servizi: ['Wi-Fi', 'Proiettore'],
    icon: '📚',
    color: '#4ECDC4'
  },
  {
    id: 9,
    nome: 'Aula Medicina',
    coordinate: [45.46520, 9.19000],
    tipo: 'aula',
    descrizione: 'Aula per facoltà di Medicina',
    capacita: '120 posti',
    servizi: ['Wi-Fi', 'Lavagna', 'Monitor'],
    icon: '🏥',
    color: '#4ECDC4'
  },
  {
    id: 10,
    nome: 'Aula Psicologia',
    coordinate: [45.46340, 9.18980],
    tipo: 'aula',
    descrizione: 'Aula per facoltà di Psicologia',
    capacita: '40 posti',
    servizi: ['Wi-Fi', 'Proiettore'],
    icon: '🧠',
    color: '#4ECDC4'
  },
  {
    id: 11,
    nome: 'Aula VR Experience',
    coordinate: [45.46440, 9.18880],
    tipo: 'aula',
    descrizione: 'Laboratorio di realtà virtuale',
    capacita: '20 posti',
    servizi: ['VR Headsets', 'PC Gaming', 'Wi-Fi'],
    icon: '🥽',
    color: '#4ECDC4'
  },
  {
    id: 12,
    nome: 'Mensa Principale',
    coordinate: [45.46430, 9.19030],
    tipo: 'mensa',
    descrizione: 'Mensa principale con cucina italiana',
    orari: '12:00 - 15:00 / 19:00 - 21:00',
    servizi: ['Cucina Calda', 'Insalate', 'Dolci'],
    icon: '🍽️',
    color: '#FF6B6B'
  },
  {
    id: 13,
    nome: 'Bar Caffetteria',
    coordinate: [45.46460, 9.19020],
    tipo: 'mensa',
    descrizione: 'Bar con snack e bevande',
    orari: '7:30 - 20:00',
    servizi: ['Caffè', 'Panini', 'Dolci'],
    icon: '☕',
    color: '#FF6B6B'
  },
  {
    id: 14,
    nome: 'Fast Food Corner',
    coordinate: [45.46390, 9.19070],
    tipo: 'mensa',
    descrizione: 'Fast food per pranzi veloci',
    orari: '11:00 - 16:00',
    servizi: ['Burger', 'Pizza', 'Poke'],
    icon: '🍕',
    color: '#FF6B6B'
  },
  {
    id: 15,
    nome: 'Bistrot Gourmet',
    coordinate: [45.46510, 9.18950],
    tipo: 'mensa',
    descrizione: 'Ristorante per docenti e ospiti',
    orari: '12:30 - 14:30',
    servizi: ['Menu Gourmet', 'Vini', 'Dessert'],
    icon: '🌮',
    color: '#FF6B6B'
  },
  {
    id: 16,
    nome: 'Rooftop Bar',
    coordinate: [45.46350, 9.19020],
    tipo: 'mensa',
    descrizione: 'Bar panoramico sul tetto',
    orari: '10:00 - 18:00',
    servizi: ['Vista Milano', 'Aperitivi', 'Wi-Fi'],
    icon: '🌆',
    color: '#FF6B6B'
  },
  {
    id: 17,
    nome: 'Biblioteca Centrale',
    coordinate: [45.46410, 9.18920],
    tipo: 'biblioteca',
    descrizione: 'Biblioteca principale con 200.000 volumi',
    orari: '8:00 - 22:00',
    servizi: ['Studio', 'Wi-Fi', 'PC', 'Prestito'],
    icon: '📚',
    color: '#95E1D3'
  },
  {
    id: 18,
    nome: 'Biblioteca Digitale',
    coordinate: [45.46490, 9.18890],
    tipo: 'biblioteca',
    descrizione: 'Biblioteca digitale con e-books',
    orari: '24/7 (accesso online)',
    servizi: ['E-books', 'Riviste', 'Database', 'Wi-Fi'],
    icon: '💾',
    color: '#95E1D3'
  }
];

// Strade del campus
const strade = [
  {
    nome: 'Via Principale',
    coordinate: [
      [45.46470, 9.18980],
      [45.46450, 9.19050],
      [45.46400, 9.19100]
    ],
    color: '#FFD700',
    weight: 4
  },
  {
    nome: 'Via Secondaria Nord',
    coordinate: [
      [45.46520, 9.19000],
      [45.46500, 9.19080],
      [45.46450, 9.19050]
    ],
    color: '#FFA500',
    weight: 3
  },
  {
    nome: 'Via Secondaria Sud',
    coordinate: [
      [45.46380, 9.18950],
      [45.46410, 9.18920],
      [45.46430, 9.19030]
    ],
    color: '#FFA500',
    weight: 3
  },
  {
    nome: 'Viale Est',
    coordinate: [
      [45.46500, 9.19080],
      [45.46400, 9.19100],
      [45.46390, 9.19070]
    ],
    color: '#FFA500',
    weight: 3
  },
  {
    nome: 'Viale Ovest',
    coordinate: [
      [45.46520, 9.19000],
      [45.46480, 9.18920],
      [45.46410, 9.18920]
    ],
    color: '#FFA500',
    weight: 3
  },
  {
    nome: 'Percorso Pedonale 1',
    coordinate: [
      [45.46460, 9.19020],
      [45.46430, 9.19030],
      [45.46410, 9.18920]
    ],
    color: '#87CEEB',
    weight: 2,
    dashArray: '5, 10'
  },
  {
    nome: 'Percorso Pedonale 2',
    coordinate: [
      [45.46490, 9.18890],
      [45.46440, 9.18880],
      [45.46380, 9.18950]
    ],
    color: '#87CEEB',
    weight: 2,
    dashArray: '5, 10'
  },
  {
    nome: 'Percorso Pedonale 3',
    coordinate: [
      [45.46350, 9.19020],
      [45.46360, 9.19050],
      [45.46390, 9.19070]
    ],
    color: '#87CEEB',
    weight: 2,
    dashArray: '5, 10'
  }
];

// Blocchi edifici
const blocchi = [
  {
    nome: 'Blocco A',
    coordinate: [
      [45.46490, 9.18970],
      [45.46510, 9.19010],
      [45.46480, 9.19040],
      [45.46460, 9.19000]
    ],
    color: '#A51C30',
    opacity: 0.2
  },
  {
    nome: 'Blocco B',
    coordinate: [
      [45.46440, 9.19040],
      [45.46460, 9.19080],
      [45.46430, 9.19100],
      [45.46410, 9.19060]
    ],
    color: '#4ECDC4',
    opacity: 0.2
  },
  {
    nome: 'Blocco C',
    coordinate: [
      [45.46370, 9.18930],
      [45.46400, 9.18970],
      [45.46380, 9.19000],
      [45.46350, 9.18960]
    ],
    color: '#95E1D3',
    opacity: 0.2
  },
  {
    nome: 'Blocco D',
    coordinate: [
      [45.46420, 9.18900],
      [45.46450, 9.18940],
      [45.46430, 9.18970],
      [45.46400, 9.18930]
    ],
    color: '#FF6B6B',
    opacity: 0.2
  },
  {
    nome: 'Blocco E',
    coordinate: [
      [45.46480, 9.18880],
      [45.46510, 9.18920],
      [45.46490, 9.18950],
      [45.46460, 9.18910]
    ],
    color: '#FFD93D',
    opacity: 0.2
  },
  {
    nome: 'Blocco F',
    coordinate: [
      [45.46340, 9.19010],
      [45.46370, 9.19050],
      [45.46350, 9.19080],
      [45.46320, 9.19040]
    ],
    color: '#A8E6CF',
    opacity: 0.2
  }
];

// Perimetro campus
const perimetro = [
  [45.46530, 9.18860],
  [45.46540, 9.19120],
  [45.46330, 9.19130],
  [45.46320, 9.18870]
];

// Componente per flyTo
function FlyToLocation({ coordinates }) {
  const map = useMap();
  
  useEffect(() => {
    if (coordinates) {
      map.setView(coordinates, 19, {
        animate: true,
        duration: 1.5
      });
    }
  }, [coordinates, map]);
  
  return null;
}

// Componente per zoom controls
function ZoomControls({ onReset }) {
  return (
    <div className="zoom-controls">
      <button onClick={onReset} className="zoom-btn" title="Reset View">
        🎯
      </button>
    </div>
  );
}

function App() {
  const [filtroAttivo, setFiltroAttivo] = useState('tutti');
  const [edificiFiltrati, setEdificiFiltrati] = useState(edifici);
  const [ricerca, setRicerca] = useState('');
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [aiSearching, setAiSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState(null);

  // Funzione per ottenere icona specifica
  const getIconForLocation = (edificio) => {
    return edificio.icon;
  };

  // Ricerca AI con Groq
  const handleAISearch = async (query) => {
    if (!query || query.length < 3) {
      setEdificiFiltrati(edifici);
      return;
    }

    setAiSearching(true);

    try {
      const completion = await groq.chat.completions.create({
        messages: [
          {
            role: "system",
            content: `Sei un assistente per la mappa dell'Università Cattolica di Milano. 
            Hai accesso a questi edifici: ${JSON.stringify(edifici.map(e => ({
              id: e.id,
              nome: e.nome,
              tipo: e.tipo,
              descrizione: e.descrizione,
              servizi: e.servizi
            })))}
            
            Quando l'utente cerca qualcosa, rispondi SOLO con un array di ID degli edifici rilevanti in formato JSON.
            Esempio: [1, 5, 7]
            
            Se cerchi "biblioteca vicino entrata", trova biblioteche più vicine all'ingresso.
            Se cerchi "dove mangiare", trova tutte le mense.
            Se cerchi "studiare", trova biblioteche e aule studio.
            
            Rispondi SOLO con l'array di numeri, nient'altro.`
          },
          {
            role: "user",
            content: query
          }
        ],
        model: "llama-3.3-70b-versatile",
        temperature: 0.3,
        max_tokens: 100
      });

      const response = completion.choices[0]?.message?.content || '[]';
      const ids = JSON.parse(response.trim());
      
      if (Array.isArray(ids) && ids.length > 0) {
        const risultati = edifici.filter(e => ids.includes(e.id));
        setEdificiFiltrati(risultati);
        
        if (risultati.length > 0) {
          setSelectedLocation(risultati[0].coordinate);
        }
      } else {
        setEdificiFiltrati(edifici);
      }
    } catch (error) {
      console.error('Errore AI:', error);
      // Fallback: ricerca normale
      const risultati = edifici.filter(e =>
        e.nome.toLowerCase().includes(query.toLowerCase()) ||
        e.tipo.toLowerCase().includes(query.toLowerCase()) ||
        e.descrizione.toLowerCase().includes(query.toLowerCase())
      );
      setEdificiFiltrati(risultati);
    } finally {
      setAiSearching(false);
    }
  };

  // Gestisci cambio ricerca con debounce
  const handleSearchChange = (e) => {
    const value = e.target.value;
    setRicerca(value);

    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      handleAISearch(value);
    }, 800);

    setSearchTimeout(timeout);
  };

  // Gestisci filtri
  useEffect(() => {
    if (filtroAttivo === 'tutti') {
      setEdificiFiltrati(edifici);
    } else {
      const filtrati = edifici.filter(e => e.tipo === filtroAttivo);
      setEdificiFiltrati(filtrati);
    }
  }, [filtroAttivo]);

  // Conta edifici per tipo
  const conteggioTipi = {
    aula: edifici.filter(e => e.tipo === 'aula').length,
    mensa: edifici.filter(e => e.tipo === 'mensa').length,
    biblioteca: edifici.filter(e => e.tipo === 'biblioteca').length,
    ingresso: edifici.filter(e => e.tipo === 'ingresso').length
  };

  return (
    <div className="App">
      <header className="header">
        <div className="logo-container">
          <h1 className="logo">🎓 Cattolica Milano</h1>
          <p className="subtitle">Campus Interattivo</p>
        </div>
        
        <div className="search-container">
          <input
            type="text"
            placeholder="🤖 Cerca con AI: 'biblioteca vicino entrata'"
            value={ricerca}
            onChange={handleSearchChange}
            className="search-input"
          />
          {aiSearching && <div className="ai-indicator">🔮 AI sta pensando...</div>}
        </div>

        <div className="filtri">
          <button
            className={`filtro-btn ${filtroAttivo === 'tutti' ? 'active' : ''}`}
            onClick={() => setFiltroAttivo('tutti')}
          >
            Tutti <span className="badge">{edifici.length}</span>
          </button>
          <button
            className={`filtro-btn ${filtroAttivo === 'aula' ? 'active' : ''}`}
            onClick={() => setFiltroAttivo('aula')}
          >
            Aule <span className="badge">{conteggioTipi.aula}</span>
          </button>
          <button
            className={`filtro-btn ${filtroAttivo === 'mensa' ? 'active' : ''}`}
            onClick={() => setFiltroAttivo('mensa')}
          >
            Mense <span className="badge">{conteggioTipi.mensa}</span>
          </button>
          <button
            className={`filtro-btn ${filtroAttivo === 'biblioteca' ? 'active' : ''}`}
            onClick={() => setFiltroAttivo('biblioteca')}
          >
            Biblioteche <span className="badge">{conteggioTipi.biblioteca}</span>
          </button>
          <button
            className={`filtro-btn ${filtroAttivo === 'ingresso' ? 'active' : ''}`}
            onClick={() => setFiltroAttivo('ingresso')}
          >
            Ingressi <span className="badge">{conteggioTipi.ingresso}</span>
          </button>
        </div>
      </header>

      <div className="main-container">
        <div className="sidebar">
          <h3 className="sidebar-title">📍 Luoghi ({edificiFiltrati.length})</h3>
          <div className="locations-list">
            {edificiFiltrati.map(edificio => (
              <div
                key={edificio.id}
                className="location-card"
                onClick={() => setSelectedLocation(edificio.coordinate)}
                style={{ borderLeft: `4px solid ${edificio.color}` }}
              >
                <div className="location-icon">{getIconForLocation(edificio)}</div>
                <div className="location-info">
                  <h4>{edificio.nome}</h4>
                  <p className="location-type">{edificio.tipo}</p>
                  <p className="location-desc">{edificio.descrizione}</p>
                  {edificio.orari && <p className="location-hours">🕐 {edificio.orari}</p>}
                  {edificio.capacita && <p className="location-capacity">👥 {edificio.capacita}</p>}
                  <div className="location-services">
                    {edificio.servizi.map((servizio, idx) => (
                      <span key={idx} className="service-tag">{servizio}</span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="map-wrapper">
          <MapContainer
            center={CENTER}
            zoom={19}
            minZoom={19}
            maxZoom={19}
            scrollWheelZoom={false}
            touchZoom={false}
            doubleClickZoom={false}
            className="map-container"
            zoomControl={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> &copy; <a href="https://carto.com/">CARTO</a>'
              url="https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png"
              maxZoom={20}
            />

            {/* Perimetro campus */}
            <Polygon
              positions={perimetro}
              pathOptions={{
                color: '#A51C30',
                weight: 3,
                opacity: 0.8,
                fillOpacity: 0.05,
                className: 'campus-border'
              }}
            />

            {/* Blocchi edifici */}
            {blocchi.map((blocco, index) => (
              <Polygon
                key={`blocco-${index}`}
                positions={blocco.coordinate}
                pathOptions={{
                  color: blocco.color,
                  weight: 2,
                  opacity: 0.6,
                  fillColor: blocco.color,
                  fillOpacity: blocco.opacity
                }}
              />
            ))}

            {/* Strade */}
            {strade.map((strada, index) => (
              <Polyline
                key={`strada-${index}`}
                positions={strada.coordinate}
                pathOptions={{
                  color: strada.color,
                  weight: strada.weight,
                  opacity: 0.7,
                  dashArray: strada.dashArray,
                  className: 'strada-animata'
                }}
                updateWhenZooming={false}
                updateWhenIdle={true}
              />
            ))}

            {/* Marker edifici */}
            {edificiFiltrati.map(edificio => (
              <Marker
                key={edificio.id}
                position={edificio.coordinate}
                icon={L.divIcon({
                  html: `<div class="custom-marker" style="background: ${edificio.color}">
                    <span class="marker-icon">${getIconForLocation(edificio)}</span>
                  </div>`,
                  className: 'marker-pin',
                  iconSize: [40, 40],
                  iconAnchor: [20, 40]
                })}
              >
                <Popup className="custom-popup">
                  <div className="popup-content">
                    <h3>{getIconForLocation(edificio)} {edificio.nome}</h3>
                    <p className="popup-type">{edificio.tipo}</p>
                    <p className="popup-desc">{edificio.descrizione}</p>
                    {edificio.orari && <p>🕐 {edificio.orari}</p>}
                    {edificio.capacita && <p>👥 {edificio.capacita}</p>}
                    <div className="popup-services">
                      {edificio.servizi.map((servizio, idx) => (
                        <span key={idx} className="service-badge">{servizio}</span>
                      ))}
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}

            <FlyToLocation coordinates={selectedLocation} />
          </MapContainer>

          <ZoomControls onReset={() => setSelectedLocation(CENTER)} />

          <div className="stats-card">
            <h4>📊 Statistiche Campus</h4>
            <div className="stat-row">
              <span>🎓 Aule:</span>
              <span className="stat-value">{conteggioTipi.aula}</span>
            </div>
            <div className="stat-row">
              <span>🍽️ Mense:</span>
              <span className="stat-value">{conteggioTipi.mensa}</span>
            </div>
            <div className="stat-row">
              <span>📚 Biblioteche:</span>
              <span className="stat-value">{conteggioTipi.biblioteca}</span>
            </div>
            <div className="stat-row">
              <span>🏛️ Ingressi:</span>
              <span className="stat-value">{conteggioTipi.ingresso}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;
