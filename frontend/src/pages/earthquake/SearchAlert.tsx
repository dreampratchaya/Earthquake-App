import React, { useEffect } from "react";
import { Alert, Collapse } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const SearchAlert: React.FC<{
  searchAlert: {
    open: boolean;
    message: string;
    type: any;
  };
  setSearchAlert: React.Dispatch<
    React.SetStateAction<{
      open: boolean;
      message: string;
      type: string;
    }>
  >;
}> = ({ searchAlert, setSearchAlert }) => {
  const handleSetSearchAlert = () => {
    setSearchAlert(
      (prev: { open: boolean; message: string; type: string }) => ({
        ...prev,
        open: false,
      })
    );
  };
  useEffect(() => {
    if (searchAlert.open) {
      const timer = setTimeout(() => handleSetSearchAlert(), 3000);
      return () => clearTimeout(timer);
    }
  }, [searchAlert]);
  return (
    <Collapse in={searchAlert.open}>
      <ThemeProvider theme={darkTheme}>
        <Alert
          severity={searchAlert.type}
          className="loading-container"
          sx={{ fontSize: 30, "& .MuiAlert-icon": { fontSize: "40px" } }}
          variant="outlined"
        >
          {searchAlert.message}
        </Alert>
      </ThemeProvider>
    </Collapse>
  );
};

export default SearchAlert;
