import React, { useState, useRef } from 'react';
import Map from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import './AppMapbox.css';

// Importante: importa mapbox-gl per evitare problemi
import mapboxgl from 'mapbox-gl';

const MAPBOX_TOKEN = 'pk.eyJ1IjoiamFiYmExNCIsImEiOiJjbWkwcTJ2OXgxMGZiMmxzY2hjcmZiZDloIn0.kn8TakzIpB0kg3BvI1xXUA';

// Dati edifici completi
const edifici = [
  // Ingresso
  {
    id: 1,
    nome: 'Largo Gemelli - Ingresso Principale',
    tipo: 'Ingresso',
    coordinate: [9.1795, 45.4642],
    descrizione: 'Ingresso storico dell\'università',
    info: 'Punto di ritrovo principale',
    orari: 'Sempre aperto',
    servizi: ['WiFi', 'Info Point', 'Reception'],
    icon: '🎓',
    color: '#A51C30'
  },
  // Aule (10)
  {
    id: 2,
    nome: 'Aula Magna',
    tipo: 'Aula',
    coordinate: [9.1790, 45.4645],
    descrizione: 'Aula principale per eventi e cerimonie',
    info: 'Capienza: 500 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Proiettore 4K', 'Audio Dolby', 'Streaming'],
    icon: '🎭',
    color: '#FF0000'
  },
  {
    id: 3,
    nome: 'Aula Pio XI',
    tipo: 'Aula',
    coordinate: [9.1788, 45.4643],
    descrizione: 'Aula multimediale moderna',
    info: 'Capienza: 200 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Lavagna digitale', 'WiFi', 'Prese USB'],
    icon: '📖',
    color: '#FF6B6B'
  },
  {
    id: 4,
    nome: 'Aula Sant\'Agostino',
    tipo: 'Aula',
    coordinate: [9.1793, 45.4644],
    descrizione: 'Aula per lezioni magistrali',
    info: 'Capienza: 150 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Climatizzata', 'WiFi', 'Recording'],
    icon: '📖',
    color: '#FF6B6B'
  },
  {
    id: 5,
    nome: 'Aula Leonardo',
    tipo: 'Aula',
    coordinate: [9.1796, 45.4646],
    descrizione: 'Aula informatica avanzata',
    info: 'Capienza: 80 posti',
    orari: 'Lun-Ven 8:00-22:00',
    servizi: ['PC High-End', 'Software Lab', 'Stampanti'],
    icon: '💻',
    color: '#00BFFF'
  },
  {
    id: 6,
    nome: 'Aula Gemelli',
    tipo: 'Aula',
    coordinate: [9.1791, 45.4641],
    descrizione: 'Aula studio con vista giardino',
    info: 'Capienza: 120 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Silenzio', 'WiFi', 'Prese multiple'],
    icon: '📖',
    color: '#FF6B6B'
  },
  {
    id: 7,
    nome: 'Aula Montini',
    tipo: 'Aula',
    coordinate: [9.1794, 45.4647],
    descrizione: 'Aula per seminari e workshop',
    info: 'Capienza: 100 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Flessibile', 'Lavagna', 'Video'],
    icon: '📖',
    color: '#FF6B6B'
  },
  {
    id: 8,
    nome: 'Aula Colombo',
    tipo: 'Aula',
    coordinate: [9.1797, 45.4640],
    descrizione: 'Aula con tecnologia VR',
    info: 'Capienza: 60 posti',
    orari: 'Lun-Ven 9:00-19:00',
    servizi: ['VR Headsets', 'Simulazioni', '3D'],
    icon: '🥽',
    color: '#9D4EDD'
  },
  {
    id: 9,
    nome: 'Aula Dante',
    tipo: 'Aula',
    coordinate: [9.1794, 45.4639],
    descrizione: 'Aula per lingue e traduzioni',
    info: 'Capienza: 90 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Audio multilingue', 'Cuffie', 'Lab'],
    icon: '🗣️',
    color: '#06D6A0'
  },
  {
    id: 10,
    nome: 'Aula Galilei',
    tipo: 'Aula',
    coordinate: [9.1791, 45.4648],
    descrizione: 'Laboratorio scientifico',
    info: 'Capienza: 70 posti',
    orari: 'Lun-Ven 8:00-19:00',
    servizi: ['Laboratorio', 'Strumenti', 'Sicurezza'],
    icon: '🔬',
    color: '#118AB2'
  },
  {
    id: 11,
    nome: 'Aula Manzoni',
    tipo: 'Aula',
    coordinate: [9.1799, 45.4642],
    descrizione: 'Aula polivalente',
    info: 'Capienza: 180 posti',
    orari: 'Lun-Ven 8:00-20:00',
    servizi: ['Flessibile', 'WiFi', 'Clima'],
    icon: '📖',
    color: '#FF6B6B'
  },
  // Mense (5)
  {
    id: 12,
    nome: 'Mensa Centrale',
    tipo: 'Mensa',
    coordinate: [9.1792, 45.4638],
    descrizione: 'Mensa principale con cucina italiana e internazionale',
    info: '🔥 Più popolare - 800 posti',
    orari: 'Lun-Ven 12:00-14:30, 19:00-21:00',
    servizi: ['Menù vario', 'Vegetariano', 'Halal', 'Pagamento card'],
    icon: '🍽️',
    color: '#E63946'
  },
  {
    id: 13,
    nome: 'Bistrot del Chiostro',
    tipo: 'Mensa',
    coordinate: [9.1797, 45.4643],
    descrizione: 'Bistrot moderno con atmosfera rilassante',
    info: '☕ Caffetteria + pranzi veloci',
    orari: 'Lun-Ven 7:30-18:00',
    servizi: ['Caffè', 'Panini', 'Insalate', 'WiFi'],
    icon: '☕',
    color: '#F77F00'
  },
  {
    id: 14,
    nome: 'Food Court San Giuseppe',
    tipo: 'Mensa',
    coordinate: [9.1798, 45.4646],
    descrizione: 'Area food con stand multipli',
    info: '🌮 Cucina fusion e street food',
    orari: 'Lun-Ven 11:30-15:00',
    servizi: ['Pizza', 'Sushi', 'Poke', 'Burger', 'Vegan'],
    icon: '🌮',
    color: '#06D6A0'
  },
  {
    id: 15,
    nome: 'Caffè Letterario',
    tipo: 'Mensa',
    coordinate: [9.1789, 45.4641],
    descrizione: 'Caffetteria in biblioteca con area studio',
    info: '📚 Perfetto per studiare',
    orari: 'Lun-Ven 8:00-22:00',
    servizi: ['Silenzio', 'WiFi premium', 'Snacks', 'Bevande'],
    icon: '📚',
    color: '#457B9D'
  },
  {
    id: 16,
    nome: 'Sky Terrace Lounge',
    tipo: 'Mensa',
    coordinate: [9.1787, 45.4644],
    descrizione: 'Terrazza panoramica all\'ultimo piano',
    info: '🌆 Vista Milano - aperitivi',
    orari: 'Lun-Ven 10:00-20:00',
    servizi: ['Terrazza', 'Cocktails', 'Aperitivi', 'Eventi'],
    icon: '🌆',
    color: '#9D4EDD'
  },
  // Biblioteche (2)
  {
    id: 17,
    nome: 'Biblioteca Centrale',
    tipo: 'Biblioteca',
    coordinate: [9.1800, 45.4640],
    descrizione: 'Biblioteca principale - 5 piani di collezioni',
    info: '📚 1 milione di volumi',
    orari: 'Lun-Ven 8:30-23:00, Sab 9:00-19:00',
    servizi: ['Sale studio', 'Computer', 'Scansione', 'Prestito', 'Archivio digitale'],
    icon: '📚',
    color: '#2A9D8F'
  },
  {
    id: 18,
    nome: 'Biblioteca di Giurisprudenza',
    tipo: 'Biblioteca',
    coordinate: [9.1786, 45.4639],
    descrizione: 'Biblioteca specializzata in diritto',
    info: '⚖️ Testi giuridici e banche dati',
    orari: 'Lun-Ven 9:00-20:00',
    servizi: ['Banche dati giuridiche', 'Sale ricerca', 'Consulenza', 'Prestito'],
    icon: '⚖️',
    color: '#8B4513'
  }
];

// Strade del campus
const stradesGeoJSON = {
  type: 'FeatureCollection',
  features: [
    {
      type: 'Feature',
      properties: { tipo: 'principale', nome: 'Via Largo Gemelli' },
      geometry: {
        type: 'LineString',
        coordinates: [[9.1795, 45.4635], [9.1795, 45.4650]]
      }
    },
    {
      type: 'Feature',
      properties: { tipo: 'principale', nome: 'Via Sant\'Agostino' },
      geometry: {
        type: 'LineString',
        coordinates: [[9.1785, 45.4642], [9.1805, 45.4642]]
      }
    },
    {
      type: 'Feature',
      properties: { tipo: 'secondaria', nome: 'Viale del Chiostro' },
      geometry: {
        type: 'LineString',
        coordinates: [[9.1785, 45.4638], [9.1805, 45.4638]]
      }
    },
    {
      type: 'Feature',
      properties: { tipo: 'secondaria', nome: 'Via della Biblioteca' },
      geometry: {
        type: 'LineString',
        coordinates: [[9.1785, 45.4646], [9.1805, 45.4646]]
      }
    }
  ]
};

// Perimetro campus
const perimetroGeoJSON = {
  type: 'Feature',
  geometry: {
    type: 'Polygon',
    coordinates: [[
      [9.1785, 45.4650],
      [9.1805, 45.4650],
      [9.1805, 45.4635],
      [9.1785, 45.4635],
      [9.1785, 45.4650]
    ]]
  }
};

function AppMapbox() {
  const [viewState, setViewState] = useState({
    longitude: 9.1795,
    latitude: 45.4642,
    zoom: 17.5,
    pitch: 0,
    bearing: 0
  });
  
  const [filtro, setFiltro] = useState('Tutti');
  const [ricerca, setRicerca] = useState('');
  const [selectedEdificio, setSelectedEdificio] = useState(null);
  const [sidebarAperta, setSidebarAperta] = useState(false);
  const mapRef = useRef();

  const edificiFiltrati = edifici.filter(e => {
    const matchFiltro = filtro === 'Tutti' || e.tipo === filtro;
    const matchRicerca = e.nome.toLowerCase().includes(ricerca.toLowerCase()) ||
                         e.descrizione.toLowerCase().includes(ricerca.toLowerCase());
    return matchFiltro && matchRicerca;
  });
  
  const tipi = ['Tutti', 'Aula', 'Mensa', 'Biblioteca', 'Ingresso'];
  
  const contatori = {
    'Aula': edifici.filter(e => e.tipo === 'Aula').length,
    'Mensa': edifici.filter(e => e.tipo === 'Mensa').length,
    'Biblioteca': edifici.filter(e => e.tipo === 'Biblioteca').length,
    'Ingresso': edifici.filter(e => e.tipo === 'Ingresso').length
  };

  const flyToLocation = (coords) => {
    mapRef.current?.flyTo({
      center: coords,
      zoom: 19,
      duration: 2000
    });
  };

  return (
    <div className="App">
      {/* Header */}
      <div className="header">
        <div className="header-content">
          <div className="logo-section">
            <div className="logo-circle">🎓</div>
            <div>
              <h1>UniCatt Milano</h1>
              <p className="subtitle">Campus Interattivo Pro</p>
            </div>
          </div>
          
          <div className="search-container">
            <span className="search-icon">🔍</span>
            <input 
              type="text"
              placeholder="Cerca aule, mense, biblioteche..."
              value={ricerca}
              onChange={(e) => setRicerca(e.target.value)}
              className="search-input"
            />
          </div>
        </div>
        
        <div className="filtri">
          {tipi.map(tipo => (
            <button 
              key={tipo}
              className={`filtro-btn ${filtro === tipo ? 'attivo' : ''}`}
              onClick={() => setFiltro(tipo)}
            >
              <span className="filtro-emoji">
                {tipo === 'Aula' && '📚'}
                {tipo === 'Mensa' && '🍴'}
                {tipo === 'Biblioteca' && '📖'}
                {tipo === 'Ingresso' && '🎓'}
                {tipo === 'Tutti' && '🗺️'}
              </span>
              <span>{tipo}</span>
              {tipo !== 'Tutti' && <span className="badge">{contatori[tipo]}</span>}
            </button>
          ))}
        </div>
      </div>

      {/* Sidebar */}
      <button 
        className={`sidebar-toggle ${sidebarAperta ? 'aperta' : ''}`}
        onClick={() => setSidebarAperta(!sidebarAperta)}
      >
        {sidebarAperta ? '✕' : '☰'}
      </button>

      <div className={`sidebar ${sidebarAperta ? 'aperta' : ''}`}>
        <h3>📍 Locations ({edificiFiltrati.length})</h3>
        <div className="location-list">
          {edificiFiltrati.map(edificio => (
            <div 
              key={edificio.id}
              className="location-card"
              onClick={() => {
                flyToLocation(edificio.coordinate);
                setSelectedEdificio(edificio);
                setSidebarAperta(false);
              }}
            >
              <div className="location-header">
                <span className="location-emoji">{edificio.icon}</span>
                <div>
                  <h4>{edificio.nome}</h4>
                  <span className="location-tipo">{edificio.tipo}</span>
                </div>
              </div>
              <p className="location-info">{edificio.info}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Mapbox Map */}
      <Map
        ref={mapRef}
        {...viewState}
        onMove={evt => setViewState(evt.viewState)}
        style={{ width: '100%', height: '100%' }}
        mapStyle="mapbox://styles/mapbox/streets-v12"
        mapboxAccessToken={MAPBOX_TOKEN}
        minZoom={16}
        maxZoom={22}
        maxBounds={[
          [9.1780, 45.4630], // Sud-Ovest
          [9.1810, 45.4655]  // Nord-Est
        ]}
        mapLib={mapboxgl}
      >
        {/* Perimetro campus */}
        {/* Strade e marker verranno aggiunti dopo */}
      </Map>

      {/* Stats card */}
      <div className="stats-card">
        <div className="stat-item">
          <span className="stat-numero">{edifici.filter(e => e.tipo === 'Aula').length}</span>
          <span className="stat-label">Aule</span>
        </div>
        <div className="stat-item">
          <span className="stat-numero">{edifici.filter(e => e.tipo === 'Mensa').length}</span>
          <span className="stat-label">Mense</span>
        </div>
        <div className="stat-item">
          <span className="stat-numero">{edifici.filter(e => e.tipo === 'Biblioteca').length}</span>
          <span className="stat-label">Biblioteche</span>
        </div>
      </div>

      {/* Controlli zoom */}
      <div className="custom-zoom-controls">
        <button 
          className="zoom-btn" 
          onClick={() => mapRef.current?.zoomIn()}
        >+</button>
        <button 
          className="zoom-btn" 
          onClick={() => mapRef.current?.zoomOut()}
        >−</button>
        <button 
          className="zoom-btn" 
          onClick={() => {
            setViewState({
              ...viewState,
              longitude: 9.1795,
              latitude: 45.4642,
              zoom: 17.5
            });
          }}
        >🎯</button>
      </div>
    </div>
  );
}

export default AppMapbox;
