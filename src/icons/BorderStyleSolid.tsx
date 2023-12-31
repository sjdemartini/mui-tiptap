import Box from "@mui/material/Box";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "../controls/MenuButton";

function BorderStyleSolid() {
  return (
    <Box
      sx={(theme) => ({
        border: `3px solid ${theme.palette.text.primary}`,
        width: MENU_BUTTON_FONT_SIZE_DEFAULT,
        height: MENU_BUTTON_FONT_SIZE_DEFAULT,
      })}
    />
  );
}

export default BorderStyleSolid;
