import { Select, type SelectProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import MenuButtonTooltip from "./MenuButtonTooltip";

export type MenuSelectProps<T> = SelectProps<T> & {
  /** An optional tooltip to show when hovering over this Select. */
  tooltipTitle?: string;
};

const useStyles = makeStyles({ name: { MenuSelect } })((theme) => {
  return {
    rootTooltipWrapper: {
      display: "inline-flex",
    },

    selectRoot: {
      // Don't show the default outline when not hovering or focused, for better
      // style consistency with the MenuButtons
      "&:not(:hover):not(.Mui-focused) .MuiOutlinedInput-notchedOutline": {
        borderWidth: 0,
      },
    },

    select: {
      // Increase specificity to override MUI's styles
      "&&&": {
        paddingLeft: theme.spacing(1),
        paddingRight: theme.spacing(3),
      },
    },

    selectDropdownIcon: {
      // Move the caret icon closer to the right than default so the button is
      // more compact
      right: 1,
    },

    input: {
      paddingTop: "3px",
      paddingBottom: "3px",
      fontSize: "0.9em",
    },
  };
});

/** A Select that is styled to work well with other menu bar controls. */
export default function MenuSelect<T>({
  tooltipTitle,
  ...selectProps
}: MenuSelectProps<T>) {
  const { classes, cx } = useStyles();
  const select = (
    <Select<T>
      margin="none"
      variant="outlined"
      size="small"
      {...selectProps}
      inputProps={{
        ...selectProps.inputProps,
        className: cx(classes.input, selectProps.inputProps?.className),
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
      className={cx(classes.selectRoot, selectProps.className)}
      classes={{
        ...selectProps.classes,
        select: cx(classes.select, selectProps.classes?.select),
        icon: cx(classes.selectDropdownIcon, selectProps.classes?.icon),
      }}
    />
  );
  return tooltipTitle ? (
    <MenuButtonTooltip
      label="Align"
      contentWrapperClassName={classes.rootTooltipWrapper}
    >
      {select}
    </MenuButtonTooltip>
  ) : (
    select
  );
}
