import './App.css';
import React, { useState, useEffect } from "react";

import 'bootstrap/dist/css/bootstrap.min.css'; // This imports bootstrap css styles. You can use bootstrap or your own classes by using the className attribute in your elements.

const cities = {
  Austin: { lat: 30.2672, lon: -97.7431 },
  Dallas: { lat: 32.7767, lon: -96.797 },
  Houston: { lat: 29.7604, lon: -95.3698 },
};

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [selectedCity, setSelectedCity] = useState("Austin");
  const [lat, setLat] = useState(cities.Austin.lat);
  const [lon, setLon] = useState(cities.Austin.lon);
  const [customLat, setCustomLat] = useState("");
  const [customLon, setCustomLon] = useState("");

  useEffect(() => {
    fetchWeather(lat, lon);
  }, [lat, lon]);

  async function fetchWeather(latitude, longitude) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=temperature_2m&timezone=auto`;

    try {
      const response = await fetch(url);
      const data = await response.json();
      if (data.hourly) {
        setWeatherData(data.hourly.temperature_2m.slice(12, 24)); // Show next 12 hours
      }
    } catch (error) {
      console.error("Error fetching weather:", error);
    }
  }

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setLat(cities[city].lat);
    setLon(cities[city].lon);
  };

  const handleCustomLocation = () => {
    if (!customLat || !customLon) return;
    setLat(parseFloat(customLat));
    setLon(parseFloat(customLon));
    setSelectedCity(`Lat: ${customLat}, Lon: ${customLon}`);
  };

  return (
    <div>
      <h2 class="text-center">Weather Forecast</h2>

      {/* City Buttons */}
      <div class="text-center">
        {Object.keys(cities).map((city) => (
          <button
            key={city}
            onClick={() => handleCityClick(city)}
          >
            {city}
          </button>
        ))}
      </div>

      {/* Manual Latitude/Longitude Input */}
      <div class="row">
        <div class="col-5"> latitude
          <input
            type="text"
            value={customLat}
            onChange={(e) => setCustomLat(e.target.value)}
          />
        </div>

        <div class="col-5"> longitude
          <input
            type="text"
            value={customLon}
            onChange={(e) => setCustomLon(e.target.value)}
          />
        </div>
        
        <div class="col-2"><
          button onClick={handleCustomLocation}>+</button>
        </div>
        
      </div>

      {/* Weather Table */}
      <h3 class="text-center">Weather in {selectedCity}</h3>
      <div class="row">
        <div class="col-6">Time</div>
        <div class="col-6">Temperature</div>
      </div>
      <hr />

      {weatherData.length > 0 &&
        weatherData.map((temp, index) => (
          <div class="row" key={index}>
            <div class="col-6">{new Date().getHours() + index + 1}:00</div>
            <div class="col-6">{temp} °C</div>
          </div>
        ))}
    </div>
  );
}

export default App;