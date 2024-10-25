import React, { useEffect } from "react";
import { Alert, Collapse } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import "./RealTimeDataAlert.css";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const RealTimeDataAlert: React.FC<{
  realTimeAlert: boolean;
  handleSetrealTimeAlert: () => void;
}> = ({ realTimeAlert, handleSetrealTimeAlert }) => {
  useEffect(() => {
    if (realTimeAlert) {
      const timer = setTimeout(() => handleSetrealTimeAlert(), 3000);
      return () => clearTimeout(timer);
    }
  }, [realTimeAlert]);
  return (
    <Collapse in={realTimeAlert}>
      <ThemeProvider theme={darkTheme}>
        <Alert
          className={realTimeAlert ? "RealTimeDataAlert" : ""}
          sx={{
            fontSize: 18,
            "& .MuiAlert-icon": { fontSize: "25px" },
            overflow: "hidden",
          }}
        >
          New data is available!
        </Alert>
      </ThemeProvider>
    </Collapse>
  );
};

export default RealTimeDataAlert;
