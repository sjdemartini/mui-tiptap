import { ToggleButton, ToggleButtonProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import EditorMenuButtonTooltip, {
  Props as EditorMenuButtonTooltipProps,
} from "./EditorMenuButtonTooltip";

type Props = {
  tooltipLabel: EditorMenuButtonTooltipProps["label"];
  tooltipShortcutKeys?: EditorMenuButtonTooltipProps["shortcutKeys"];
  IconComponent: React.ElementType<{ className: string }>;
} & ToggleButtonProps;

const useStyles = makeStyles({ name: { EditorMenuButton } })({
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

export default function EditorMenuButton({
  tooltipLabel,
  tooltipShortcutKeys,
  IconComponent,
  ...toggleButtonProps
}: Props) {
  const { classes } = useStyles();
  return (
    <span className={classes.root}>
      <EditorMenuButtonTooltip
        label={tooltipLabel}
        shortcutKeys={tooltipShortcutKeys}
      >
        <ToggleButton size="small" {...toggleButtonProps}>
          <IconComponent className={classes.menuButtonIcon} />
        </ToggleButton>
      </EditorMenuButtonTooltip>
    </span>
  );
}
