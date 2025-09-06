import {
  Divider,
  styled,
  useThemeProps,
  type DividerProps,
  type SxProps,
} from "@mui/material";
import { clsx } from "clsx";
import {
  menuDividerClasses,
  type MenuDividerClassKey,
  type MenuDividerClasses,
} from "./MenuDivider.classes";
import { getUtilityComponentName } from "./styles";

// The orientation of our menu dividers will always be vertical
export type MenuDividerProps = Omit<
  DividerProps,
  "orientation" | "className" | "classes"
> & {
  /** Optional additional className to provide to the root element. */
  className?: string;
  /** Override or extend existing styles. */
  classes?: Partial<MenuDividerClasses>;
  /** Provide custom styles. */
  sx?: SxProps;
};

const componentName = getUtilityComponentName("MenuDivider");

const MenuDividerRoot = styled(Divider, {
  name: componentName,
  slot: "root" satisfies MenuDividerClassKey,
  overridesResolver: (props, styles) => styles.root,
})(({ theme }) => ({
  height: 18,
  margin: theme.spacing(0, 0.5),
}));

export default function MenuDivider(inProps: MenuDividerProps) {
  const props = useThemeProps({ props: inProps, name: componentName });
  const { className, classes = {}, sx, ...dividerProps } = props;

  return (
    <MenuDividerRoot
      orientation="vertical"
      {...dividerProps}
      className={clsx([menuDividerClasses.root, className, classes.root])}
      sx={sx}
    />
  );
}
