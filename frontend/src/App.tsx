import React, { useEffect, useState, useRef, useCallback } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  LayersControl,
} from "react-leaflet";
import L, { marker } from "leaflet";
import "leaflet/dist/leaflet.css";
import MarkerClusterGroup from "react-leaflet-cluster";
import SearchInput from "./SearchInput";
import EarthquakeLegend from "./EarthquakeLegend";
import EarthquakeList from "./EarthquakeList";
import "./earthquake-app-styles.css";

type Earthquake = {
  properties: {
    mag: number;
    place: string;
    time: number;
    tsunami: boolean;
  };
  geometry: {
    coordinates: [number, number, number];
  };
  id: string;
};

const App: React.FC = () => {
  const [earthquakes, setEarthquakes] = useState<Earthquake[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [date, setDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [animationKey, setAnimationKey] = useState(0);
  const mapRef = useRef<L.Map | null>(null);
  const intervalRef = useRef<number | null>(null);
  const [selectedEarthquake, setSelectedEarthquake] = useState(null);
  const [autoRefresh, setAutoRefresh] = useState<boolean>(true);

  // Custom icon for better visibility on dark background
  const createCustomIcon = (magnitude: number) => {
    let pulseScale = 0;
    let colorScale1 = "";
    let colorScale2 = "";
    if (magnitude < 2.5) {
      pulseScale = 10;
      colorScale1 = "rgb(74, 144, 226)";
      colorScale2 = "rgba(74, 144, 226, 0.2)";
    } else if (magnitude >= 2.5 && magnitude < 5.4) {
      pulseScale = 15;
      colorScale1 = "rgb(28, 162, 102)";
      colorScale2 = "rgba(28, 162, 102, 0.2)";
    } else if (magnitude >= 5.4 && magnitude < 6.0) {
      pulseScale = 20;
      colorScale1 = "rgb(248, 255, 82)";
      colorScale2 = "rgba(248, 255, 82, 0.2)";
    } else if (magnitude >= 6.0 && magnitude < 7.0) {
      pulseScale = 25;
      colorScale1 = "rgb(249, 128, 11)";
      colorScale2 = "rgba(249, 128, 11, 0.2)";
    } else if (magnitude >= 7.0 && magnitude < 8.0) {
      pulseScale = 30;
      colorScale1 = "rgb(255, 92, 16)";
      colorScale2 = "rgba(255, 92, 16, 0.2)";
    } else if (magnitude > 8.0) {
      pulseScale = 35;
      colorScale1 = "rgb(255, 3, 26)";
      colorScale2 = "rgba(255, 3, 26, 0.2)";
    }
    return L.divIcon({
      className: "custom-div-icon",
      html: `<div class='marker-pin' style='--pulse-scale:${pulseScale}; --color-scale1:${colorScale1}; --color-scale2:${colorScale2};'></div>`,
      iconSize: [30, 30],
      iconAnchor: [15, 15],
    });
  };

  const fetchEarthquakeData = useCallback(
    async (selectedDate: string) => {
      autoRefresh ? setLoading(false) : setLoading(true);
      setError(null);

      const nextDay = new Date(selectedDate);
      nextDay.setDate(nextDay.getDate() + 1);
      const formattedNextDay = nextDay.toISOString().split("T")[0];

      // const apiUrl = `https://earthquake.usgs.gov/fdsnws/event/1/query?format=geojson&starttime=${selectedDate}&endtime=${formattedNextDay}`;
      const apiUrl = `/api/earthquake?start=${selectedDate}&end=${formattedNextDay}`;

      try {
        const response = await axios.get(apiUrl);
        setEarthquakes(response.data || []);
      } catch (err) {
        setError("Failed to fetch earthquake data.");
      } finally {
        setLoading(false);
      }
    },
    [date]
  );

  useEffect(() => {
    // Apply dark mode styles to the whole page
    document.body.style.backgroundColor = "#242424";
    document.body.style.color = "#ffffff";
    fetchEarthquakeData(date);
    const style = document.createElement("style");
    style.textContent = `
    .marker-pin {
      width: 10px;
      height: 10px;
      border-radius: 50%;
      background: var(--color-scale1);
      position: relative;
    }
    .marker-pin::after {
      content: '';
      width: 10px;
      height: 10px;
      border-radius: 50%;
      position: absolute;
      background: var(--color-scale2);
      animation: pulse 5s ease-out infinite;
    }
    @keyframes pulse {
      0% {
          transform: scale(1);
          opacity: 1;
      }
      100% {
          transform: scale(var(--pulse-scale, 3));
          opacity: 0;
      }
    `;
    document.head.appendChild(style);
    if (autoRefresh && isToday(date)) {
      intervalRef.current = setInterval(() => {
        fetchEarthquakeData(date);
        console.log("auto refresh!");
      }, 180000);
    }
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        console.log("Interval cleared!");
      }
    };
  }, [date]);

  const isToday = (dateStr: string) => {
    const today = new Date().toISOString().split("T")[0];
    return dateStr === today;
  };

  useEffect(() => {
    // Trigger animation every 5 seconds
    const interval = setInterval(() => {
      setAnimationKey((prev) => prev + 1);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!loading) {
      setDate(e.target.value);
      fetchEarthquakeData(e.target.value);
      setAutoRefresh(isToday(e.target.value));
    }
  };

  const handleSearch = async (query: string) => {
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
          query
        )}`
      );
      if (response.data && response.data.length > 0) {
        const { lat, lon, addresstype } = response.data[0];
        const newCenter: [number, number] = [parseFloat(lat), parseFloat(lon)];
        setError(null);
        if (addresstype === "country") {
          mapRef.current?.setView(newCenter, 5);
        } else {
          mapRef.current?.setView(newCenter, 8);
        }
      } else {
        setError("Location not found");
      }
    } catch (err) {
      setError("Error searching for location");
    }
  };

  return (
    <div style={{ height: "100vh", width: "100%" }}>
      <MapContainer
        center={[13.7669983, 100.5445685]}
        zoom={5}
        style={{ height: "99vh", width: "100%" }}
        worldCopyJump={true}
        ref={mapRef}
      >
        <LayersControl position="topright">
          <LayersControl.BaseLayer name="CartoDB.DarkMatter" checked>
            <TileLayer
              url="https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
              maxZoom={15}
              minZoom={4.5}
            />
          </LayersControl.BaseLayer>
          <LayersControl.BaseLayer name="OpenStreetMap.HOT">
            <TileLayer
              url="https://{s}.tile.openstreetmap.fr/hot/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, Tiles style by <a href="https://www.hotosm.org/" target="_blank">Humanitarian OpenStreetMap Team</a> hosted by <a href="https://openstreetmap.fr/" target="_blank">OpenStreetMap France</a>'
              maxZoom={15}
              minZoom={4.5}
            />
          </LayersControl.BaseLayer>
          <LayersControl.Overlay name="Plate Boundaries" checked>
            <TileLayer
              url="https://earthquake.usgs.gov/basemap/tiles/plates/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.usgs.gov/">USGS</a>'
              maxZoom={15}
              minZoom={4.5}
              className="leaflet-layer-ring-of-fire"
            />
          </LayersControl.Overlay>
          <LayersControl.Overlay name="Population Density">
            <TileLayer
              url="https://earthquake.usgs.gov/arcgis/rest/services/eq/pager_landscan2018bin/MapServer/tile/{z}/{y}/{x}"
              attribution='&copy; <a href="https://www.usgs.gov/">USGS</a>'
              maxZoom={15}
              minZoom={4.5}
              className="leaflet-layer-population-density"
            />
          </LayersControl.Overlay>
        </LayersControl>
        {loading ? (
          <div className="loading-container">
            <p className="loading-container-label">Loading...</p>
          </div>
        ) : error ? (
          <div className="loading-container">
            <p className="loading-container-label">{error}</p>
          </div>
        ) : earthquakes.length === 0 ? (
          <div className="loading-container">
            <p className="loading-container-label">
              No earthquake data found for this date.
            </p>
          </div>
        ) : (
          <MarkerClusterGroup
            chunkedLoading
            maxClusterRadius={20}
            showCoverageOnHover={false}
            removeOutsideVisibleBounds={false}
            chunkDelay={0}
            chunkInterval={0}
            iconCreateFunction={(cluster) => {
              const childMarkers = cluster.getAllChildMarkers();
              const maxMagnitude = Math.max(
                ...childMarkers.map((marker) => marker.options.magnitude)
              );
              return createCustomIcon(maxMagnitude);
            }}
          >
            {earthquakes.map((earthquake) => (
              <Marker
                position={[
                  earthquake.geometry.coordinates[1],
                  earthquake.geometry.coordinates[0],
                ]}
                icon={createCustomIcon(earthquake.properties.mag)}
                key={
                  earthquake._id
                    ? `${earthquake._id}`
                    : `${crypto.randomUUID()}`
                }
                magnitude={earthquake.properties.mag}
                eventHandlers={{
                  click: () => setSelectedEarthquake(earthquake),
                }}
              >
                <Popup className="dark-popup">
                  {earthquake.properties.place} <br />{" "}
                  {earthquake.geometry.coordinates[1]},{" "}
                  {earthquake.geometry.coordinates[0]} <br /> Magnitude:{" "}
                  {earthquake.properties.mag} <br />
                  Tsunami:{" "}
                  <span
                    style={{
                      color: earthquake.properties.tsunami ? "red" : "green",
                      fontWeight: "bold",
                    }}
                  >
                    {" "}
                    {earthquake.properties.tsunami ? "Yes" : "No"}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MarkerClusterGroup>
        )}
      </MapContainer>
      <SearchInput onSearch={handleSearch} />
      <div className="EarthquakeLegend">
        <EarthquakeLegend />
      </div>
      <EarthquakeList
        earthquakes={earthquakes}
        mapRef={mapRef}
        handleSelectedEarthquake={setSelectedEarthquake}
        SelectedEarthquake={selectedEarthquake}
      />
      <div className="auto-refresh-indicator">
        {isToday(date) && autoRefresh ? (
          <div className="refresh-active">
            <span className="pulse-dot"></span>
            <span style={{ color: "red" }}>Live</span> Data
          </div>
        ) : (
          <div className="refresh-inactive">
            <span style={{ color: "gray" }}>Offline</span> Data
          </div>
        )}
      </div>
      <div className="date-input-container">
        <input
          type="date"
          value={date}
          onChange={handleDateChange}
          className="date-input"
        />
      </div>
    </div>
  );
};

export default App;
