import { useState } from "react";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const SearchInput: React.FC<{ onSearch: (query: string) => void }> = ({
  onSearch,
}) => {
  const [query, setQuery] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
    setQuery("");
  };

  return (
    <form onSubmit={handleSubmit} className="search-container">
      <ThemeProvider theme={darkTheme}>
        <TextField
          className="search-input"
          id="outlined-basic"
          label="Search location"
          variant="outlined"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          sx={{
            "& label": { paddingLeft: (theme) => theme.spacing(2) },
            "& input": { paddingLeft: (theme) => theme.spacing(3.5) },
            "& fieldset": {
              paddingLeft: (theme) => theme.spacing(2.5),
              borderRadius: "25px",
            },
          }}
        />
        <Button
          variant="outlined"
          type="submit"
          className="search-button"
          sx={{
            marginLeft: 1,
            height: 55,
            color: "white",
            border: "0.1px solid rgba(255, 255, 255, 0.3)",
            borderRadius: 7,
          }}
        >
          Search
        </Button>
      </ThemeProvider>
    </form>
  );
};

export default SearchInput;
