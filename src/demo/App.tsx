import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import CloseIcon from "@mui/icons-material/Close";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import IconButton from "@mui/material/IconButton";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import {
  ThemeProvider,
  createTheme,
  type PaletteMode,
} from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useCallback, useMemo, useState } from "react";
import Editor from "./Editor";

export default function App() {
  const systemSettingsPrefersDarkMode = useMediaQuery(
    "(prefers-color-scheme: dark)",
  );
  const [paletteMode, setPaletteMode] = useState<PaletteMode>(
    systemSettingsPrefersDarkMode ? "dark" : "light",
  );
  const [dialogOpen, setDialogOpen] = useState(false);
  const togglePaletteMode = useCallback(() => {
    setPaletteMode((prevMode) => (prevMode === "light" ? "dark" : "light"));
  }, []);
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: paletteMode,
          secondary: {
            main: "#42B81A",
          },
        },
      }),
    [paletteMode],
  );

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            mui-tiptap
          </Typography>

          <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
            <Button
              onClick={() => {
                setDialogOpen(true);
              }}
              variant="text"
              size="small"
              color="inherit"
            >
              View in a dialog
            </Button>
            <IconButton
              onClick={togglePaletteMode}
              color="inherit"
              aria-label={
                theme.palette.mode === "dark"
                  ? "Switch to light mode"
                  : "Switch to dark mode"
              }
            >
              {theme.palette.mode === "dark" ? (
                <Brightness7Icon />
              ) : (
                <Brightness4Icon />
              )}
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      <Box component="main" sx={{ p: 3, maxWidth: 1207, margin: "0 auto" }}>
        <Editor />
      </Box>

      <Dialog
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
        }}
        maxWidth="xl"
        slotProps={{ paper: { sx: { overflowY: "auto", maxHeight: "70vh" } } }}
        aria-labelledby="editor-dialog-title"
      >
        <DialogTitle id="editor-dialog-title">Editor in a dialog</DialogTitle>
        <IconButton
          onClick={() => {
            setDialogOpen(false);
          }}
          aria-label="close"
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <CloseIcon />
        </IconButton>

        <DialogContent>
          <Editor disableStickyMenuBar />
        </DialogContent>
      </Dialog>
    </ThemeProvider>
  );
}
