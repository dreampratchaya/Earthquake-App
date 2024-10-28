import TextField from "@mui/material/TextField";
import SearchIcon from "@mui/icons-material/Search";
import { IconButton } from "@mui/material";
import { InputAdornment } from "@mui/material";
import { ThemeProvider, createTheme } from "@mui/material/styles";

const darkTheme = createTheme({
  palette: {
    mode: "dark",
  },
});

const SearchInput: React.FC<{
  onSearch: (query: string) => void;
  SetQuery: React.Dispatch<React.SetStateAction<string>>;
  query: string;
}> = ({ onSearch, SetQuery, query }) => {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query);
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
          onChange={(e) => {
            SetQuery(e.target.value);
          }}
          sx={{
            "& label": { paddingLeft: (theme) => theme.spacing(2.25) },
            "& input": { paddingLeft: (theme) => theme.spacing(3.5) },
            "& fieldset": {
              paddingLeft: (theme) => theme.spacing(2.5),
              borderRadius: "25px",
            },
          }}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    aria-label="Search"
                    edge="end"
                    type="submit"
                    sx={{ marginRight: "-8px" }}
                  >
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            },
          }}
        />
      </ThemeProvider>
    </form>
  );
};

export default SearchInput;
