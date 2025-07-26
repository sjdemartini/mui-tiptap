import { styled, useThemeProps, type SxProps } from "@mui/material";
import { clsx } from "clsx";
import {
  useCallback,
  useEffect,
  type Dispatch,
  type SetStateAction,
} from "react";
import { getComponentName } from "../styles";
import {
  resizableImageResizerClasses,
  type ResizableImageResizerClassKey,
  type ResizableImageResizerClasses,
} from "./ResizableImageResizer.classes";

type ResizableImageResizerProps = {
  className?: string;
  onResize: (event: MouseEvent) => void;
  mouseDown: boolean;
  setMouseDown: Dispatch<SetStateAction<boolean>>;
  /** Override or extend existing styles. */
  classes?: Partial<ResizableImageResizerClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

const componentName = getComponentName("ResizableImageResizer");

const ResizableImageResizerRoot = styled("div", {
  name: componentName,
  slot: "root" satisfies ResizableImageResizerClassKey,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  position: "absolute",
  // The `outline` styles of the selected image add 3px to the edges, so we'll
  // position this offset by 3px outside to the bottom right
  bottom: -3,
  right: -3,
  width: 12,
  height: 12,
  background: theme.palette.primary.main,
  cursor: "nwse-resize",
}));

export function ResizableImageResizer(inProps: ResizableImageResizerProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    onResize,
    className,
    mouseDown,
    setMouseDown,
    classes = {},
    sx,
  } = props;

  useEffect(() => {
    if (!mouseDown) {
      return;
    }

    // If the user is currently holding down the resize handle, we'll have mouse
    // movements fire the onResize callback (since the user would be "dragging"
    // the handle).
    const handleMouseMove = (event: MouseEvent) => {
      onResize(event);
    };

    window.addEventListener("mousemove", handleMouseMove);
    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [mouseDown, onResize]);

  useEffect(() => {
    const handleMouseUp = () => {
      setMouseDown(false);
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => {
      window.removeEventListener("mouseup", handleMouseUp);
    };
  }, [setMouseDown]);

  const handleMouseDown = useCallback(
    (event: React.MouseEvent) => {
      // Ensure this click event doesn't trigger dragging of the image itself
      event.preventDefault();
      event.stopPropagation();
      setMouseDown(true);
    },
    [setMouseDown],
  );

  return (
    // There isn't a great role to use here (perhaps role="separator" is the
    // closest, as described here https://stackoverflow.com/a/43022983/4543977,
    // but we don't do keyboard-based resizing at this time so it doesn't make
    // sense to have it keyboard focusable)

    <ResizableImageResizerRoot
      // TODO(Steven DeMartini): Add keyboard support and better accessibility
      // here, and allow users to override the aria-label when that happens to
      // support localization.
      // aria-label="resize image"
      className={clsx([
        resizableImageResizerClasses.root,
        className,
        classes.root,
      ])}
      onMouseDown={handleMouseDown}
      sx={sx}
    />
  );
}
