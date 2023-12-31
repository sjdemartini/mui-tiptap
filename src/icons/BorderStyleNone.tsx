import Box from "@mui/material/Box";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "../controls/MenuButton";

function BorderStyleNone() {
  return (
    <Box
      sx={(theme) => ({
        border: `3px none ${theme.palette.text.primary}`,
        width: MENU_BUTTON_FONT_SIZE_DEFAULT,
        height: MENU_BUTTON_FONT_SIZE_DEFAULT,
      })}
    />
  );
}

export default BorderStyleNone;
