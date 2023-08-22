import { Tooltip, Typography, alpha, type TooltipProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";
import { getModShortcutKey } from "../utils/platform";

export type MenuButtonTooltipProps = {
  /**
   * Used to display what this button is responsible for. Ex: "Ordered list".
   */
  label: string;
  /**
   * An array representing the set of keys that should be pressed to trigger
   * this action (for its keyboard shortcut), so that this can be displayed to
   * the user. If empty, no keyboard shortcut is displayed.
   *
   * Use the literal string "mod" to represent Cmd on Mac and Ctrl on Windows
   * and Linux.
   *
   * Example: ["mod", "Shift", "7"] is the array that should be provided as the
   * combination for toggling an ordered list.
   *
   * For the list of pre-configured Tiptap shortcuts, see
   * https://tiptap.dev/api/keyboard-shortcuts.
   */
  shortcutKeys?: string[];
  /** Where the tooltip should be placed. By default "top" (above). */
  placement?: TooltipProps["placement"];
  /**
   * Class applied to the element that contains the children content. We add an
   * intermediary element since Tooltip requires a non-disabled child element in
   * order to render, and we want to allow tooltips to show up even when buttons
   * are disabled.
   */
  contentWrapperClassName?: string;
  /** The menu element for which we're showing a tooltip when hovering. */
  children: React.ReactNode;
} & Pick<TooltipProps, "open" | "onOpen" | "onClose">;

const useStyles = makeStyles({ name: { MenuButtonTooltip } })((theme) => ({
  titleContainer: {
    textAlign: "center",
  },

  label: {
    fontSize: theme.typography.pxToRem(13),
  },

  shortcutKey: {
    fontSize: theme.typography.pxToRem(12),
    border: `1px solid ${alpha(theme.palette.text.secondary, 0.2)}`,
    backgroundColor: alpha(theme.palette.background.paper, 0.3),
    height: "19px",
    lineHeight: "19px",
    padding: "0 4px",
    minWidth: 17,
    borderRadius: theme.shape.borderRadius,
    display: "inline-block",

    "&:not(:first-of-type)": {
      marginLeft: 1,
    },
  },
}));

export default function MenuButtonTooltip({
  label,
  shortcutKeys,
  placement = "top",
  contentWrapperClassName,
  children,
  ...otherTooltipProps
}: MenuButtonTooltipProps) {
  const { classes } = useStyles();
  return (
    <Tooltip
      title={
        label || (shortcutKeys && shortcutKeys.length > 0) ? (
          <div className={classes.titleContainer}>
            <div className={classes.label}>{label}</div>

            {shortcutKeys && shortcutKeys.length > 0 && (
              <Typography variant="body2" component="div">
                {shortcutKeys.map((shortcutKey, index) => (
                  <span className={classes.shortcutKey} key={index}>
                    {shortcutKey === "mod" ? getModShortcutKey() : shortcutKey}
                  </span>
                ))}
              </Typography>
            )}
          </div>
        ) : (
          ""
        )
      }
      placement={placement}
      arrow
      {...otherTooltipProps}
    >
      {/* Use a span around the children so we show a tooltip even if the
      element inside is disabled */}
      <span className={contentWrapperClassName}>{children}</span>
    </Tooltip>
  );
}
