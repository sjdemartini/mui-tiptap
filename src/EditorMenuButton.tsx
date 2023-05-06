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

const useStyles = makeStyles()({
  root: {
    "& .MuiToggleButton-root": {
      border: "none",
      padding: 5,
    },
  },

  menuButtonIcon: {
    fontSize: "1.25rem",
  },
});

function EditorMenuButton({
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

export default EditorMenuButton;
