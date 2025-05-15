import React, { useState } from "react";
import { searchArea, getAreaInfo } from "./api";
import "./App.css";

function App() {
  const [searchText, setSearchText] = useState("");
  const [areas, setAreas] = useState([]);
  const [areaInfo, setAreaInfo] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSearch = async () => {
    if (!searchText.trim()) return;

    setError(null);
    setLoading(true);

    try {
      const result = await searchArea(searchText);
      setAreas(result.areas || []);
      setAreaInfo(null);
    } catch (err) {
      console.error("Search failed:", err);
      setError("Failed to fetch areas. Please try again later.");
    } finally {
      setLoading(false); // stop loading
    }
  };

  const handleSelectArea = async (id) => {
    const info = await getAreaInfo(id);
    setAreaInfo(info);
  };

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
        {loading && <div className="spinner"></div>}
      </div>

      {error && <div className="error-message">{error}</div>}

      {areas.length > 0 && (
        <ul className="area-list">
          {areas.map((area) => {
            const isMeaningfulMunicipality =
              area.municipality &&
              !area.municipality.toLowerCase().includes("eskom");

            const displayParts = [
              isMeaningfulMunicipality ? area.municipality : null,
              area.region,
            ].filter(Boolean);

            return (
              <li key={area.id} className="area-item">
                <span>
                  {area.name}
                  {displayParts.length ? ` - ${displayParts.join(", ")}` : ""}
                </span>
                <button onClick={() => handleSelectArea(area.id)}>
                  Select
                </button>
              </li>
            );
          })}
        </ul>
      )}

      {areaInfo && (
        <div className="area-info">
          <h2>Area Info</h2>
          <p>
            <strong>Name:</strong> {areaInfo.info.name}
          </p>
          <p>
            <strong>Region:</strong> {areaInfo.info.region}
          </p>
          <p>
            <strong>Stage:</strong>{" "}
            {areaInfo.events?.[0]?.note || "No current events"}
          </p>

          <div className="event-list">
            <h3>Upcoming Loadshedding:</h3>
            <ul>
              {areaInfo.events?.length ? (
                areaInfo.events.map((event, index) => {
                  const start = new Date(event.start);
                  const end = new Date(event.end);

                  const datePart = start.toLocaleDateString("en-ZA", {
                    day: "2-digit",
                    month: "short",
                    year: "numeric",
                  });

                  const startTime24 = start.toLocaleTimeString("en-ZA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  const endTime24 = end.toLocaleTimeString("en-ZA", {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: false,
                  });

                  const to12HourFormat = (time24) => {
                    const [hour, minute] = time24.split(":");
                    const h = parseInt(hour, 10);
                    const ampm = h >= 12 ? "PM" : "AM";
                    const hour12 = h % 12 || 12;
                    return `${hour12}:${minute} ${ampm}`;
                  };

                  const sentence = `On ${datePart}, Loadshedding will start from ${to12HourFormat(
                    startTime24
                  )} to ${to12HourFormat(endTime24)} (${event.note})`;

                  return (
                    <li key={index}>
                      {datePart}, {startTime24} → {endTime24} ({event.note})
                      <br />
                      <em>{sentence}</em>
                    </li>
                  );
                })
              ) : (
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
