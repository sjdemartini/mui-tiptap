import Box, { type BoxProps } from "@mui/material/Box";
import { styled, useThemeProps } from "@mui/material/styles";
import { clsx } from "clsx";
import { getUtilityComponentName } from "../styles";
import DebounceRender, {
  type DebounceRenderProps,
} from "../utils/DebounceRender";
import {
  menuControlsContainerClasses,
  type MenuControlsContainerClassKey,
  type MenuControlsContainerClasses,
} from "./MenuControlsContainer.classes";

export type MenuControlsContainerProps = Omit<
  BoxProps,
  "children" | "className" | "classes"
> & {
  /** The set of controls (buttons, etc) to include in the menu bar. */
  children?: React.ReactNode;
  /** Class applied to the `root` element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuControlsContainerClasses>;
  /**
   * If true, the rendering of the children content here will be debounced, as a
   * way to improve performance. If this component is rendered in the same
   * context as Tiptap's `useEditor` and *not* debounced, then upon every editor
   * interaction (caret movement, character typed, etc.), the entire controls
   * content will re-render, which can bog down the editor, so debouncing is
   * usually recommended. Controls are often expensive to render since they need
   * to check a lot of editor state, with `editor.can()` commands and whatnot.
   */
  debounced?: boolean;
  /**
   * Override the props/options used with debounce rendering such as the wait
   * interval, if `debounced` is true.
   */
  DebounceProps?: Partial<Omit<DebounceRenderProps, "children">>;
};

const componentName = getUtilityComponentName("MenuControlsContainer");

const MenuControlsContainerRoot = styled(Box, {
  name: componentName,
  slot: "root" satisfies MenuControlsContainerClassKey,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  display: "flex",
  rowGap: theme.spacing(0.3),
  columnGap: theme.spacing(0.3),
  alignItems: "center",
  flexWrap: "wrap",
}));

/** Provides consistent spacing between different editor controls components. */
export default function MenuControlsContainer(
  inProps: MenuControlsContainerProps,
) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const {
    children,
    className,
    classes = {},
    sx,
    debounced,
    DebounceProps,
    ...boxProps
  } = props;

  const content = (
    <MenuControlsContainerRoot
      {...boxProps}
      className={clsx([
        menuControlsContainerClasses.root,
        className,
        classes.root,
      ])}
      sx={sx}
    >
      {children}
    </MenuControlsContainerRoot>
  );

  return debounced ? (
    <DebounceRender {...DebounceProps}>{content}</DebounceRender>
  ) : (
    content
  );
}
