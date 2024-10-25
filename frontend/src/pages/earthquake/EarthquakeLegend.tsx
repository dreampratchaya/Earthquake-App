import React from "react";
import "./EarthquakeLegend.css";

const EarthquakeLegend: React.FC = () => {
  return (
    <div className="legend-container">
      <div className="legend-title">Magnitude</div>
      <div className="border-gray"></div>
      <div className="legend-scale">
        <div className="scale-gradient" />
        <div className="scale-labels">
          <span>8.0 or greater</span>
          <span>7.0 to 7.9</span>
          <span>6.1 to 6.9</span>
          <span>5.5 to 6.0</span>
          <span>2.5 to 5.4</span>
          <span>2.5 or less</span>
        </div>
      </div>
    </div>
  );
};

export default EarthquakeLegend;
