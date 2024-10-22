import "./EarthquakeList.css";
const EarthquakeList: React.FC<{
  earthquakes: any;
  mapRef: any;
  handleSelectedEarthquake: any;
  SelectedEarthquake: any;
}> = ({
  earthquakes,
  mapRef,
  handleSelectedEarthquake,
  SelectedEarthquake,
}) => {
  const sortedEarthquakes = [...earthquakes].sort(
    (a, b) => b.properties.time - a.properties.time
  );
  return (
    <div className="earthquake-sidebar">
      {SelectedEarthquake && (
        <div className="selected-earthquake-details">
          <button
            className="back-button"
            onClick={() => handleSelectedEarthquake(null)}
          >
            ← Back to list
          </button>
          <h2 className="detail-title">Earthquake Details</h2>
          <div className="detail-content">
            <div
              className="detail-magnitude"
              style={{
                backgroundColor:
                  SelectedEarthquake.properties.mag < 2.5
                    ? "rgba(74, 144, 226, 0.9)"
                    : SelectedEarthquake.properties.mag < 5.4
                    ? "rgba(28, 162, 102, 0.9)"
                    : SelectedEarthquake.properties.mag < 6.0
                    ? "rgba(248, 255, 82, 0.9)"
                    : SelectedEarthquake.properties.mag < 7.0
                    ? "rgba(249, 128, 11, 0.9)"
                    : SelectedEarthquake.properties.mag < 8.0
                    ? "rgba(255, 92, 16, 0.9)"
                    : "rgba(255, 3, 26, 0.9)",
              }}
            >
              {SelectedEarthquake.properties.mag.toFixed(1)}
            </div>
            <div className="detail-info">
              <h3>Location</h3>
              <p>{SelectedEarthquake.properties.place}</p>

              <h3>Time</h3>
              <p>
                {new Date(SelectedEarthquake.properties.time).toUTCString()}
              </p>

              <h3>Coordinates</h3>
              <p>
                Latitude:{" "}
                {SelectedEarthquake.geometry.coordinates[1].toFixed(4)}
              </p>
              <p>
                Longitude:{" "}
                {SelectedEarthquake.geometry.coordinates[0].toFixed(4)}
              </p>
              <p>
                Tsunami:{" "}
                <span
                  style={{
                    color: SelectedEarthquake.properties.tsunami
                      ? "red"
                      : "green",
                    fontWeight: "bold",
                  }}
                >
                  {" "}
                  {SelectedEarthquake.properties.tsunami ? "Yes" : "No"}{" "}
                </span>
              </p>

              <h3>Depth</h3>
              <p>{SelectedEarthquake.geometry.coordinates[2].toFixed(2)} km</p>
            </div>
          </div>
        </div>
      )}
      {!SelectedEarthquake && (
        <div className="earthquake-list">
          <h2 className="sidebar-title">Earthquake Data</h2>
          {sortedEarthquakes.map((quake) => (
            <div
              key={quake._id}
              className="earthquake-item"
              onClick={() => {
                handleSelectedEarthquake(quake);
                mapRef.current?.flyTo(
                  [
                    quake.geometry.coordinates[1],
                    quake.geometry.coordinates[0],
                  ],
                  8
                );
              }}
            >
              <div className="earthquake-item-content">
                <div
                  className="magnitude-indicator"
                  style={{
                    backgroundColor:
                      quake.properties.mag < 2.5
                        ? "rgba(74, 144, 226, 0.9)"
                        : quake.properties.mag < 5.4
                        ? "rgba(28, 162, 102, 0.9)"
                        : quake.properties.mag < 6.0
                        ? "rgba(248, 255, 82, 0.9)"
                        : quake.properties.mag < 7.0
                        ? "rgba(249, 128, 11, 0.9)"
                        : quake.properties.mag < 8.0
                        ? "rgba(255, 92, 16, 0.9)"
                        : "rgba(255, 3, 26, 0.9)",
                  }}
                >
                  {quake.properties.mag
                    ? quake.properties.mag.toFixed(1)
                    : null}
                </div>
                <div className="earthquake-details">
                  <h3 className="location">{quake.properties.place}</h3>
                  <p className="timestamp">
                    {new Date(quake.properties.time).toUTCString()}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default EarthquakeList;
