import React, { useEffect } from "react";
import { Alert, Collapse } from "@mui/material";
import "./RealTimeDataAlert.css";

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
      <Alert
        className={realTimeAlert ? "RealTimeDataAlert" : ""}
        sx={{ fontSize: 18, "& .MuiAlert-icon": { fontSize: "25px" } }}
      >
        New data is available!
      </Alert>
    </Collapse>
  );
};

export default RealTimeDataAlert;
