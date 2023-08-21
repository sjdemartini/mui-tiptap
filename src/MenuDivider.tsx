import { Divider, type DividerProps } from "@mui/material";
import { makeStyles } from "tss-react/mui";

// The orientation of our menu dividers will always be vertical
export type MenuDividerProps = Omit<DividerProps, "orientation">;

const useStyles = makeStyles({ name: { MenuDivider } })((theme) => ({
  root: {
    height: 18,
    margin: theme.spacing(0, 0.5),
  },
}));

export default function MenuDivider(props: MenuDividerProps) {
  const { classes, cx } = useStyles();
  return (
    <Divider
      orientation="vertical"
      {...props}
      className={cx(classes.root, props.className)}
    />
  );
}
