import { outlinedInputClasses } from "@mui/material/OutlinedInput";
import Select, { selectClasses, type SelectProps } from "@mui/material/Select";
import { styled, useThemeProps, type SxProps } from "@mui/material/styles";
import { svgIconClasses } from "@mui/material/SvgIcon";
import { clsx } from "clsx";
import { useState } from "react";
import { getUtilityComponentName } from "../styles";
import MenuButtonTooltip from "./MenuButtonTooltip";
import {
  menuSelectClasses,
  type MenuSelectClasses,
  type MenuSelectClassKey,
} from "./MenuSelect.classes";

export interface MenuSelectProps<T>
  extends Omit<SelectProps<T>, "margin" | "variant" | "size" | "classes"> {
  /** An optional tooltip to show when hovering over this Select. */
  tooltipTitle?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuSelectClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
}

const componentName = getUtilityComponentName("MenuSelect");

const MenuSelectRoot = styled(Select, {
  name: componentName,
  slot: "root" satisfies MenuSelectClassKey,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  // Don't show the default outline when not hovering or focused, for better
  // style consistency with the MenuButtons
  [`&:not(:hover):not(.${outlinedInputClasses.focused}) .${outlinedInputClasses.notchedOutline}`]:
    {
      borderWidth: 0,
    },

  [`& .${svgIconClasses.root}`]: {
    // Ensure that if an icon is used as the `renderValue` result, it uses
    // the same color as the default ToggleButton icon and the Select
    // dropdown arrow icon
    // https://github.com/mui/material-ui/blob/2cb9664b16d5a862a3796add7c8e3b088b47acb5/packages/mui-material/src/ToggleButton/ToggleButton.js#L60,
    // https://github.com/mui/material-ui/blob/0b7beb93c9015da6e35c2a31510f679126cf0de1/packages/mui-material/src/NativeSelect/NativeSelectInput.js#L96
    color: theme.palette.action.active,
  },

  [`&.${selectClasses.disabled} .${svgIconClasses.root}`]: {
    // Matching
    // https://github.com/mui/material-ui/blob/2cb9664b16d5a862a3796add7c8e3b088b47acb5/packages/mui-material/src/ToggleButton/ToggleButton.js#L65
    color: theme.palette.action.disabled,
  },

  [`& .${selectClasses.select}`]: {
    paddingTop: "3px",
    paddingBottom: "3px",
    fontSize: "0.9em",
  },

  // Increase specificity to override MUI's styles
  [`&&& .${selectClasses.select}`]: {
    paddingLeft: theme.spacing(1),
    paddingRight: theme.spacing(3),
  },

  [`& .${selectClasses.icon}`]: {
    // Move the caret icon closer to the right than default so the button is
    // more compact
    right: 1,
  },

  // The type casting below is a hacky workaround to support generics with the
  // `styled` wrapper, per https://stackoverflow.com/a/72163115,
  // https://github.com/mui/material-ui/blob/7e90b18d0e21ece648e5074970900b05fea03989/docs/data/material/guides/typescript/typescript.md#complications-with-the-component-prop
})) as unknown as typeof Select;

const MenuSelectTooltip = styled(MenuButtonTooltip, {
  name: componentName,
  slot: "tooltip" satisfies MenuSelectClassKey,
  overridesResolver: (props, styles) => styles.tooltip,
})({
  display: "inline-flex",
});

/** A Select that is styled to work well with other menu bar controls. */
export default function MenuSelect<T>(inProps: MenuSelectProps<T>) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const { tooltipTitle, classes = {}, sx, ...selectProps } = props;

  // We use a controlled tooltip here because otherwise it seems the tooltip can
  // get stuck open after selecting something (as it can re-trigger the
  // Tooltip's onOpen upon clicking a MenuItem). We instead trigger it to
  // open/close based on interaction specifically with the Select (not the usual
  // Tooltip onOpen/onClose)
  const [tooltipOpen, setTooltipOpen] = useState(false);

  const select = (
    <MenuSelectRoot<T>
      margin="none"
      variant="outlined"
      size="small"
      {...selectProps}
      onMouseEnter={(...args) => {
        setTooltipOpen(true);
        selectProps.onMouseEnter?.(...args);
      }}
      onMouseLeave={(...args) => {
        setTooltipOpen(false);
        selectProps.onMouseLeave?.(...args);
      }}
      onClick={(...args) => {
        setTooltipOpen(false);
        selectProps.onClick?.(...args);
      }}
      onOpen={(...args) => {
        // Close the tooltip when the dropdown is opened. This can ensure the
        // tooltip doesn't block menu items, etc. (see
        // https://github.com/sjdemartini/mui-tiptap/issues/308).
        setTooltipOpen(false);
        selectProps.onOpen?.(...args);
      }}
      // Always show the dropdown options directly below the select input,
      // aligned to left-most edge
      MenuProps={{
        anchorOrigin: {
          vertical: "bottom",
          horizontal: "left",
        },
        transformOrigin: {
          vertical: "top",
          horizontal: "left",
        },
        ...selectProps.MenuProps,
      }}
      className={clsx([
        menuSelectClasses.root,
        classes.root,
        selectProps.className,
      ])}
      sx={sx}
    />
  );

  return tooltipTitle ? (
    <MenuSelectTooltip
      label={tooltipTitle}
      open={tooltipOpen}
      className={clsx([menuSelectClasses.tooltip, classes.tooltip])}
    >
      {select}
    </MenuSelectTooltip>
  ) : (
    select
  );
}
