import { makeStyles } from "tss-react/mui";

export type MenuControlsContainerProps = {
  /** The set of controls (buttons, etc) to include in the menu bar. */
  children?: React.ReactNode;
  className?: string;
};

const useStyles = makeStyles({
  name: { MenuControlsContainer: MenuControlsContainer },
})((theme) => {
  return {
    root: {
      display: "flex",
      rowGap: theme.spacing(0.3),
      columnGap: theme.spacing(0.3),
      alignItems: "center",
      flexWrap: "wrap",
    },
  };
});

/** Provides consistent spacing between different editor controls components. */
export default function MenuControlsContainer({
  children,
  className,
}: MenuControlsContainerProps) {
  const { classes, cx } = useStyles();
  return <div className={cx(classes.root, className)}>{children}</div>;
}
