import { Divider, styled } from "@mui/material";

const StyledDivider = styled(Divider)(({ theme }) => ({
  height: 18,
  margin: theme.spacing(0, 0.5),
}));

export default function MenuDivider() {
  return <StyledDivider orientation="vertical" />;
}
