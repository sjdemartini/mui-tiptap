import { Divider, styled } from "@mui/material";

const StyledDivider = styled(Divider)(({ theme }) => ({
  height: 18,
  margin: theme.spacing(0, 0.5),
}));

/**
 * Renders a vertical line divider to separate different sections of your menu
 * bar and implicitly group separate controls.
 */
export default function MenuDivider() {
  return <StyledDivider orientation="vertical" />;
}
