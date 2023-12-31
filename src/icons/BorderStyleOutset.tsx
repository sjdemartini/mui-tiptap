import Box from "@mui/material/Box";
import { MENU_BUTTON_FONT_SIZE_DEFAULT } from "../controls/MenuButton";

function BorderStyleOutset() {
  return (
    <Box
      sx={(theme) => ({
        border: `3px outset ${theme.palette.text.primary}`,
        width: MENU_BUTTON_FONT_SIZE_DEFAULT,
        height: MENU_BUTTON_FONT_SIZE_DEFAULT,
      })}
    />
  );
}

export default BorderStyleOutset;
