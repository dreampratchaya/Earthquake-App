import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select, { SelectChangeEvent } from "@mui/material/Select";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import "./EarthquakeList.css";
import { useState, ChangeEvent, useEffect, useCallback } from "react";
import SearchInput from "./SearchInput";
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
  _id: string;
};
const EarthquakeList: React.FC<{
  earthquakes: any;
  mapRef: React.MutableRefObject<L.Map | null>;
  handleSelectedEarthquake: React.Dispatch<
    React.SetStateAction<Earthquake | null>
  >;
  SelectedEarthquake: any;
  onSearch: (query: string) => void;
}> = ({
  earthquakes,
  mapRef,
  handleSelectedEarthquake,
  SelectedEarthquake,
  onSearch,
}) => {
  const [sort, setSort] = useState("Newest");
  const [localTime, setLocalTime] = useState(false);
  const [query, setQuery] = useState("");
  const [filteredEarthquakes, setFilteredEarthquakes] =
    useState<Earthquake[]>(earthquakes);
  const darkTheme = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const handleQuery = useCallback(() => {
    const filterData = earthquakes.filter((data: any) =>
      data.properties.place.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredEarthquakes(filterData);
  }, [query, earthquakes]);

  // Update earthquakes when query or sort changes
  useEffect(() => {
    handleQuery();
  }, [query, handleQuery]);

  const sortedEarthquakes = [...filteredEarthquakes].sort((a, b) =>
    sort === "Newest"
      ? b.properties.time - a.properties.time
      : b.properties.mag - a.properties.mag
  );
  const handleChange = (event: SelectChangeEvent) => {
    setSort(event.target.value as string);
  };
  const handleSwitch = (e: ChangeEvent<HTMLInputElement>) => {
    setLocalTime(e.target.checked);
  };
  return (
    <>
      <SearchInput onSearch={onSearch} SetQuery={setQuery} query={query} />
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
                <h3>
                  {" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M8 16.016a7.5 7.5 0 0 0 1.962-14.74A1 1 0 0 0 9 0H7a1 1 0 0 0-.962 1.276A7.5 7.5 0 0 0 8 16.016m6.5-7.5a6.5 6.5 0 1 1-13 0 6.5 6.5 0 0 1 13 0" />
                    <path d="m6.94 7.44 4.95-2.83-2.83 4.95-4.949 2.83 2.828-4.95z" />
                  </svg>{" "}
                  Location
                </h3>
                <p>{SelectedEarthquake.properties.place}</p>

                <h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path d="M11 6.5a.5.5 0 0 1 .5-.5h1a.5.5 0 0 1 .5.5v1a.5.5 0 0 1-.5.5h-1a.5.5 0 0 1-.5-.5z" />
                    <path d="M3.5 0a.5.5 0 0 1 .5.5V1h8V.5a.5.5 0 0 1 1 0V1h1a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V3a2 2 0 0 1 2-2h1V.5a.5.5 0 0 1 .5-.5M1 4v10a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V4z" />
                  </svg>{" "}
                  Time
                </h3>
                <p>
                  {localTime
                    ? new Date(SelectedEarthquake.properties.time).toString()
                    : new Date(
                        SelectedEarthquake.properties.time
                      ).toUTCString()}
                </p>

                <h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M15.817.113A.5.5 0 0 1 16 .5v14a.5.5 0 0 1-.402.49l-5 1a.5.5 0 0 1-.196 0L5.5 15.01l-4.902.98A.5.5 0 0 1 0 15.5v-14a.5.5 0 0 1 .402-.49l5-1a.5.5 0 0 1 .196 0L10.5.99l4.902-.98a.5.5 0 0 1 .415.103M10 1.91l-4-.8v12.98l4 .8zm1 12.98 4-.8V1.11l-4 .8zm-6-.8V1.11l-4 .8v12.98z"
                    />
                  </svg>{" "}
                  Coordinates
                </h3>
                <p>
                  Latitude:{" "}
                  {SelectedEarthquake.geometry.coordinates[1].toFixed(4)}
                </p>
                <p>
                  Longitude:{" "}
                  {SelectedEarthquake.geometry.coordinates[0].toFixed(4)}
                </p>
                <h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                    style={{ marginRight: "4px" }}
                  >
                    <path d="M.036 12.314a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65m0 2a.5.5 0 0 1 .65-.278l1.757.703a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.014-.406a2.5 2.5 0 0 1 1.857 0l1.015.406a1.5 1.5 0 0 0 1.114 0l1.757-.703a.5.5 0 1 1 .372.928l-1.758.703a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.014-.406a1.5 1.5 0 0 0-1.114 0l-1.015.406a2.5 2.5 0 0 1-1.857 0l-1.757-.703a.5.5 0 0 1-.278-.65M2.662 8.08c-.456 1.063-.994 2.098-1.842 2.804a.5.5 0 0 1-.64-.768c.652-.544 1.114-1.384 1.564-2.43.14-.328.281-.68.427-1.044.302-.754.624-1.559 1.01-2.308C3.763 3.2 4.528 2.105 5.7 1.299 6.877.49 8.418 0 10.5 0c1.463 0 2.511.4 3.179 1.058.67.66.893 1.518.819 2.302-.074.771-.441 1.516-1.02 1.965a1.88 1.88 0 0 1-1.904.27c-.65.642-.907 1.679-.71 2.614C11.076 9.215 11.784 10 13 10h2.5a.5.5 0 0 1 0 1H13c-1.784 0-2.826-1.215-3.114-2.585-.232-1.1.005-2.373.758-3.284L10.5 5.06l-.777.388a.5.5 0 0 1-.447 0l-1-.5a.5.5 0 0 1 .447-.894l.777.388.776-.388a.5.5 0 0 1 .447 0l1 .5.034.018c.44.264.81.195 1.108-.036.328-.255.586-.729.637-1.27.05-.529-.1-1.076-.525-1.495s-1.19-.77-2.477-.77c-1.918 0-3.252.448-4.232 1.123C5.283 2.8 4.61 3.738 4.07 4.79c-.365.71-.655 1.433-.945 2.16-.15.376-.301.753-.463 1.13" />
                  </svg>
                  Tsunami
                </h3>
                <p>
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

                <h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    fill="currentColor"
                    viewBox="0 0 16 16"
                  >
                    <path
                      fillRule="evenodd"
                      d="M1 3.5a.5.5 0 0 1 .5-.5h13a.5.5 0 0 1 0 1h-13a.5.5 0 0 1-.5-.5M8 6a.5.5 0 0 1 .5.5v5.793l2.146-2.147a.5.5 0 0 1 .708.708l-3 3a.5.5 0 0 1-.708 0l-3-3a.5.5 0 0 1 .708-.708L7.5 12.293V6.5A.5.5 0 0 1 8 6"
                    />
                  </svg>{" "}
                  Depth
                </h3>
                <p>
                  {SelectedEarthquake.geometry.coordinates[2].toFixed(2)} km
                </p>
              </div>
            </div>
          </div>
        )}
        {!SelectedEarthquake && (
          <div className="earthquake-list">
            <ThemeProvider theme={darkTheme}>
              <span
                style={{
                  margin: "1rem 0",
                  display: "flex",
                  gap: "10px",
                }}
              >
                <h2
                  className="sidebar-title"
                  style={{ width: 200, paddingLeft: 5 }}
                >
                  Earthquake Data
                </h2>
                <FormControlLabel
                  control={
                    <Switch
                      color="warning"
                      checked={localTime}
                      onChange={handleSwitch}
                    />
                  }
                  label="Local Time"
                  sx={{
                    paddingTop: "12px",
                    width: 170,
                  }}
                />
              </span>
              <FormControl
                fullWidth
                sx={{
                  "& label": { paddingLeft: (theme) => theme.spacing(2.25) },
                  "& input": { paddingLeft: (theme) => theme.spacing(3.5) },
                  "& fieldset": {
                    paddingLeft: (theme) => theme.spacing(2.5),
                    borderRadius: "15px",
                  },
                }}
              >
                <InputLabel id="demo-simple-select-label">Sort</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={sort}
                  label="Sort"
                  onChange={handleChange}
                >
                  <MenuItem value="Newest">Newest First (UTC Time)</MenuItem>
                  <MenuItem value="Magnitude">Magnitude</MenuItem>
                </Select>
              </FormControl>
            </ThemeProvider>
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
                      {localTime
                        ? new Date(quake.properties.time)
                            .toString()
                            .split("(")[0]
                        : new Date(quake.properties.time).toUTCString()}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
};

export default EarthquakeList;
