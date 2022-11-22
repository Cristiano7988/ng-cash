import { createTheme, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router";
import { router } from "./routes";

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const App = () => {
  return (
    <ThemeProvider theme={darkTheme}>
      <RouterProvider router={router} />
    </ThemeProvider>
  );
};

export default App;
