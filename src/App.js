import React, { useState } from 'react';
import { searchArea, getAreaInfo } from './api';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState('');
  const [areas, setAreas] = useState([]);
  const [areaInfo, setAreaInfo] = useState(null);
  

const handleSearch = async () => {
  if (!searchText.trim()) return;
  setLoading(true);
  try {
    const result = await searchArea(searchText);
    setAreas(result.areas || []);
    setAreaInfo(null);
  } catch (err) {
    console.error('Search failed:', err);
  } finally {
    setLoading(false);
  }
};

const [favorites, setFavorites] = useState(() => {
  const saved = localStorage.getItem('favorites');
  return saved ? JSON.parse(saved) : [];
});


const handleSelectArea = async (id) => {
  setLoading(true);
  try {
    const info = await getAreaInfo(id);
    setAreaInfo(info);
  } catch (err) {
    console.error('Area info fetch failed:', err);
  } finally {
    setLoading(false);
  }
};

const toggleFavorite = (area) => {
  const exists = favorites.find((fav) => fav.id === area.id);
  let updated;

  if (exists) {
    updated = favorites.filter((fav) => fav.id !== area.id);
  } else {
    updated = [...favorites, area];
  }

  setFavorites(updated);
  localStorage.setItem('favorites', JSON.stringify(updated));
};

const isFavorite = (id) => favorites.some((fav) => fav.id === id);


  const [loading, setLoading] = useState(false);


  return (
    <div className="container">
      <h1>Loadshedding Tracker</h1>

      <div className="input-group">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Enter area name (e.g., Cape Town)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {loading && <p>Loading...</p>}

{favorites.length > 0 && (
  <div>
    <h2>My Favorites</h2>
   <ul className="area-list">
  {favorites.map((area) => (
    <li key={area.id} className="area-item">
      <span>{area.name}</span>
<div style={{ display: 'inline-flex', gap: '0.5rem', marginLeft: '1rem' }}>
  <button onClick={() => handleSelectArea(area.id)}>Select</button>
  <button onClick={() => toggleFavorite(area)}>
    {isFavorite(area.id) ? '★' : '☆'}
  </button>
</div>

    </li>
  ))}
</ul>

  </div>
)}


{areas.length > 0 && (
  <ul className="area-list">
    {areas.map((area) => {
      const isMeaningfulMunicipality = area.municipality &&
        !area.municipality.toLowerCase().includes('eskom');

      const displayParts = [
        isMeaningfulMunicipality ? area.municipality : null,
        area.region
      ].filter(Boolean);

      return (
        <li key={area.id} className="area-item">
          <span>{`${area.name}${displayParts.length ? ` - ${displayParts.join(', ')}` : ''}`}</span>
          <button onClick={() => handleSelectArea(area.id)}>Select</button>
          <button onClick={() => toggleFavorite(area)}>
            {isFavorite(area.id) ? '★' : '☆'}
          </button>
        </li>
      );
    })}
  </ul>
)}



      {areaInfo && (
        <div className="area-info">
          <h2>Area Info</h2>
          <p><strong>Name:</strong> {areaInfo.info.name}</p>
          <p><strong>Region:</strong> {areaInfo.info.region}</p>
          <p><strong>Stage:</strong> {areaInfo.events?.[0]?.note || 'No current events'}</p>

          <div className="event-list">
            <h3>Upcoming Events:</h3>
            <ul>
              {areaInfo.events?.length ? areaInfo.events.map((event, index) => {
                const start = new Date(event.start);
                const end = new Date(event.end);

                const datePart = start.toLocaleDateString('en-ZA', {
                  day: '2-digit',
                  month: 'short',
                  year: 'numeric',
                });

                const startTime = start.toLocaleTimeString('en-ZA', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                const endTime = end.toLocaleTimeString('en-ZA', {
                  hour: '2-digit',
                  minute: '2-digit',
                });

                return (
                  <li key={index}>
                    {datePart}, {startTime} → {endTime} ({event.note})
                    <em>On {datePart}, Loadshedding from {startTime} to {endTime} ({event.note})</em>
                  </li>
                );
              }) : (
                <li>No upcoming events</li>
              )}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;
