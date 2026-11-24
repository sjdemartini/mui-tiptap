import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import CssBaseline from "@mui/material/CssBaseline";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  ThemeProvider,
  createTheme,
  useColorScheme,
} from "@mui/material/styles";
import { useMemo } from "react";
import PageContentWithEditor from "./PageContentWithEditor";

function ColorSchemeToggle() {
  const { mode, setMode, systemMode } = useColorScheme();
  const resolvedMode = mode === "system" ? systemMode : mode;
  const isDarkMode = resolvedMode === "dark";

  return (
    <IconButton
      onClick={() => {
        setMode(isDarkMode ? "light" : "dark");
      }}
      color="inherit"
      aria-label={isDarkMode ? "Switch to light mode" : "Switch to dark mode"}
    >
      {isDarkMode ? <Brightness7Icon /> : <Brightness4Icon />}
    </IconButton>
  );
}

export default function App() {
  const theme = useMemo(
    () =>
      createTheme({
        cssVariables: {
          colorSchemeSelector: "class",
        },
        colorSchemes: {
          light: true,
          dark: true,
        },

        components: {
          MuiTiptapMenuBar: {
            styleOverrides: {
              root: ({ theme }) => ({
                backgroundColor: (theme.vars || theme).palette.grey[100],
                ...theme.applyStyles("dark", {
                  backgroundColor: (theme.vars || theme).palette.grey[900],
                }),
              }),
            },
          },
        },
      }),
    [],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <div>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Example app using <code>mui-tiptap</code>
            </Typography>

            <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
              <ColorSchemeToggle />
            </Box>
          </Toolbar>
        </AppBar>

        <Box sx={{ maxWidth: 1200, my: 3, mx: "auto", px: 2 }}>
          <PageContentWithEditor />
        </Box>
      </div>
    </ThemeProvider>
  );
}
