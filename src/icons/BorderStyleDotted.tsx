import Box from "@mui/material/Box";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "../controls/MenuButton";

function BorderStyleDotted() {
  return (
    <Box
      sx={(theme) => ({
        border: `3px dotted ${theme.palette.text.primary}`,
        width: MENU_BUTTON_FONT_SIZE_DEFAULT,
        height: MENU_BUTTON_FONT_SIZE_DEFAULT,
      })}
    />
  );
}

export default BorderStyleDotted;
