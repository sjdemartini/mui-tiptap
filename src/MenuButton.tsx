import { ToggleButton, type ToggleButtonProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import MenuButtonTooltip, {
  type MenuButtonTooltipProps,
} from "./MenuButtonTooltip";

export type MenuButtonProps = {
  tooltipLabel: MenuButtonTooltipProps["label"];
  tooltipShortcutKeys?: MenuButtonTooltipProps["shortcutKeys"];
  IconComponent: React.ElementType<{ className: string }>;
} & ToggleButtonProps;

const useStyles = makeStyles({ name: { MenuButton } })({
  root: {
    // Use && for additional specificity, since MUI's conditional "disabled"
    // styles also set the border
    "&& .MuiToggleButton-root": {
      border: "none",
      padding: 5,
    },
  },

  menuButtonIcon: {
    fontSize: "1.25rem",
  },
});

export default function MenuButton({
  tooltipLabel,
  tooltipShortcutKeys,
  IconComponent,
  ...toggleButtonProps
}: MenuButtonProps) {
  const { classes } = useStyles();
  return (
    <span className={classes.root}>
      <MenuButtonTooltip
        label={tooltipLabel}
        shortcutKeys={tooltipShortcutKeys}
      >
        <ToggleButton size="small" {...toggleButtonProps}>
          <IconComponent className={classes.menuButtonIcon} />
        </ToggleButton>
      </MenuButtonTooltip>
    </span>
  );
}
