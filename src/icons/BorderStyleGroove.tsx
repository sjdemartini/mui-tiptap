import { createSvgIcon } from "@mui/material";

const BorderStyleOutset = createSvgIcon(
  <>
    <path d="M10 20 H190" stroke="currentColor" />
    <path d="M10 120 H190" stroke="currentColor" />
    <path d="M10 20 V120" stroke="currentColor" />
    <path d="M190 20 V120" stroke="currentColor" />
  </>,
  "BorderStyleOutset"
);

export default BorderStyleOutset;
