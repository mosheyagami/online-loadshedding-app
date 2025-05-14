import React, { useState } from 'react';
import { searchArea, getAreaInfo } from './api';
import './App.css';

function App() {
  const [searchText, setSearchText] = useState('');
  const [areas, setAreas] = useState([]);
  const [areaInfo, setAreaInfo] = useState(null);

  const handleSearch = async () => {
    try {
      const result = await searchArea(searchText);
      setAreas(result.areas || []);
      setAreaInfo(null);
    } catch (error) {
      console.error('Search error:', error);
      alert('Failed to search areas. Please try again.');
    }
  };

  const handleSelectArea = async (id) => {
    try {
      const info = await getAreaInfo(id);
      setAreaInfo(info);
    } catch (error) {
      console.error('Area info fetch error:', error);
      alert('Failed to fetch area info. Please try again.');
    }
  };

  return (
    <div className="container">
      <h1>React Loadshedding Tracker</h1>

      <div className="input-group">
        <input
          type="text"
          value={searchText}
          onChange={(e) => setSearchText(e.target.value)}
          placeholder="Enter area name (e.g., Cape Town)"
        />
        <button onClick={handleSearch}>Search</button>
      </div>

      {areas.length > 0 && (
        <ul className="area-list">
          {areas.map((area) => (
            <li key={area.id} className="area-item">
              <span>{area.name}</span>
              <button onClick={() => handleSelectArea(area.id)}>Select</button>
            </li>
          ))}
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
