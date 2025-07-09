import {
  alpha,
  darken,
  lighten,
  type CSSObject,
  type Theme,
} from "@mui/material";
import omit from "lodash/omit";
import { keyframes } from "tss-react";

type StyleRules = Record<string, CSSObject>;

export const Z_INDEXES = {
  TABLE_ELEMENT: 1,
  // The menu bar must sit higher than the table components (like the
  // column-resize-handle and selectedCells) of the editor.
  MENU_BAR: 2,
  // The notched outline of the "outlined" field variant should be at the same z-index
  // as the menu-bar, so that it can contain/enclose it
  NOTCHED_OUTLINE: 2,
} as const;

// Don't crash if a user has removed the default variants
// (https://mui.com/material-ui/customization/typography/#adding-amp-disabling-variants,
// https://github.com/sjdemartini/mui-tiptap/issues/339). Typography-dependent
// styles will be omitted in this case. Consumers should likely use a
// nested ThemeProvider around mui-tiptap components
// (https://mui.com/material-ui/customization/theming/#nesting-the-theme) to
// define the typography styles they want to use if their main theme doesn't
// include them, based on MUI's default typography variants.
type ThemeWithOptionalTypographyVariants = Omit<Theme, "typography"> & {
  typography: Partial<Theme["typography"]>;
};

export function getEditorStyles(
  theme: ThemeWithOptionalTypographyVariants,
): StyleRules {
  // Check whether the user has enabled responsive typography
  // (https://mui.com/material-ui/customization/typography/#responsive-font-sizes)
  const hasResponsiveStyles = Object.keys(theme.typography.h1 ?? {}).some(
    (key) => key.includes("@media"),
  );

  const cursorDelayOpacityChangeAnimation = keyframes`
    0%, 95% {
      opacity: 1;
    }
    100% {
      opacity: 0;
    }
  `;

  return {
    // Include all of the body1 text styles except for line-height, since we want a
    // little less height (falling back to the default line-height)
    ...omit(theme.typography.body1, ["lineHeight"]),

    "&:focus": {
      outline: "none",
    },

    "& h1": {
      // We don't use MUI's default heading typography styles of h1-h6 here
      // since h1 and h2 are a bit too huge/dramatic. Instead, we use h3-h6,
      // subtitle1, and subtitle2.

      // For h1, we take our usual font family, set a bold font weight, and set
      // the font size based on a scaled-up 20% increase to `typography.h4`
      // (which we use as our next smaller header). Note that if the MUI
      // `responsiveFontSizes` theme utility was used, we increase the font size
      // at all responsive breakpoints.
      fontFamily: theme.typography.h3?.fontFamily,
      fontWeight: "bold",

      ...(hasResponsiveStyles
        ? {
            fontSize: `${(1.5625 * 1.2).toFixed(4)}rem`,

            [theme.breakpoints.up("sm")]: {
              fontSize: `${(1.8219 * 1.2).toFixed(4)}rem`,
            },

            [theme.breakpoints.up("md")]: {
              fontSize: `${(2.0243 * 1.2).toFixed(4)}rem`,
            },

            [theme.breakpoints.up("lg")]: {
              fontSize: `${(2.0243 * 1.2).toFixed(4)}rem`,
            },
          }
        : {
            fontSize: `${(2.0243 * 1.2).toFixed(4)}rem`,
          }),
    },

    "& h2": {
      ...omit(theme.typography.h4, ["lineHeight"]),
      fontWeight: 500,
    },

    "& h3": {
      ...omit(theme.typography.h5, ["lineHeight"]),
      fontWeight: 500,
    },

    "& h4": {
      ...omit(theme.typography.h6, ["lineHeight"]),
      fontWeight: 500,
    },

    "& h5": {
      ...omit(theme.typography.subtitle1, ["lineHeight"]),
      fontWeight: 500,
    },

    "& h6": {
      ...omit(theme.typography.subtitle2, ["lineHeight"]),
      fontWeight: 500,
    },

    // Remove above/below margins from all of our blocks
    "& h1, & h2, & h3, & h4, & h5, & h6, & p": {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },

    '& a:not([data-type="mention"])': {
      color: theme.palette.primary.main,
      textDecoration: "none",

      "&:hover": {
        textDecoration: "underline",
      },
    },

    "& ul, & ol": {
      marginBlockStart: 0,
      marginBlockEnd: 0,
    },

    "& ol": {
      listStyleType: "decimal",
      "& ol": {
        listStyleType: "lower-alpha",
        "& ol": {
          listStyleType: "lower-roman",
          "& ol": {
            listStyleType: "decimal",
            "& ol": {
              listStyleType: "lower-alpha",
              "& ol": {
                listStyleType: "lower-roman",
              },
            },
          },
        },
      },
    },

    // Note that although browsers would typically match for the first three
    // here (disc, circle, then square), this gets broken if the editor happens
    // to be rendering inside of some outer list. (We also improve the deeper
    // nested uls somewhat while we're at it).
    "& ul": {
      listStyleType: "disc",
      "& ul": {
        listStyleType: "circle",
        "& ul": {
          listStyleType: "square",
          "& ul": {
            listStyleType: "disc",
            "& ul": {
              listStyleType: "circle",
              "& ul": {
                listStyleType: "square",
              },
            },
          },
        },
      },
    },

    // These styles are based on the example here https://tiptap.dev/api/nodes/task-list
    '& ul[data-type="taskList"]': {
      listStyle: "none",
      padding: 0,

      "& li": {
        display: "flex",

        "& > label": {
          flex: "0 0 auto",
          marginRight: "0.5rem",
          userSelect: "none",
        },

        "& > div": {
          flex: "1 1 auto",
        },
      },
    },

    "& blockquote": {
      paddingLeft: "1rem",
      marginInlineStart: theme.spacing(1),
      marginInlineEnd: theme.spacing(1),
      position: "relative", // This allows us to use a pseudo-element with absolute positioning inside

      "&:before": {
        // This pseudo-element approach mimics Slack's technique, which allows
        // for rounded edges
        position: "absolute",
        top: 0,
        bottom: 0,
        left: 0,
        display: "block",
        width: 4,
        borderRadius: theme.shape.borderRadius,
        background: theme.palette.text.disabled,
        content: '""',
      },
    },

    "& :not(pre) > code": {
      padding: "2px 3px 1px",
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
      borderRadius: 3,
      backgroundColor: theme.palette.action.hover,
      color:
        theme.palette.mode === "dark"
          ? theme.palette.secondary.main
          : darken(theme.palette.secondary.dark, 0.1),
    },

    "& pre": {
      marginTop: theme.spacing(0.5),
      marginBottom: theme.spacing(0.5),
      padding: theme.spacing(1),
      borderWidth: 1,
      borderStyle: "solid",
      borderColor: theme.palette.divider,
      borderRadius: theme.shape.borderRadius,
      background: theme.palette.action.hover,
      // By default the line-height of some monospace fonts (like "Ubuntu Mono")
      // appears to be a bit taller than necessary in pre block format
      lineHeight: 1.4,
      overflowX: "auto",
      // Override the default Prosemirror styles, which use pre-wrap. We want code
      // blocks to be horizontally scrollable, like they are on GitHub or StackOverflow
      // (since that makes reading code, logs, etc. much easier), with no wrapping.
      whiteSpace: "pre !important" as "pre",
    },

    '& [data-type="mention"]': {
      padding: "0 0.25rem",
      // Setting the line-height here prevents the at-mentions from bumping up against
      // one another on consecutive lines
      lineHeight: "1.3em",
      borderRadius: theme.shape.borderRadius,
      color: theme.palette.primary.main,
      background:
        theme.palette.mode === "dark"
          ? alpha(darken(theme.palette.primary.dark, 0.7), 0.5)
          : alpha(lighten(theme.palette.primary.light, 0.6), 0.3),
      textDecoration: "none",
    },

    // We style all images which are *not* the ProseMirror-separator (an element added
    // via Prosemirror, which is there for a hack to get contenteditable to appear
    // correctly for text blocks and line breaks; see
    // https://discuss.prosemirror.net/t/what-is-addhacknode/4254)
    "& img:not(.ProseMirror-separator)": {
      // TODO(Steven DeMartini): Decide if we should let folks make the images wider
      // than the doc. If so, we'll need to make the overall doc container hide overflow
      // and add a scrollbar
      maxWidth: "100%",
      height: "auto",
      // Using inline-flex allows the image to be correctly positioned, whether
      // the Image/ResizableImage extension is configured with `inline` as false
      // or true. In the former case (the default), it should have other
      // block-level elements on either side of it, allowing it to flow
      // correctly as a block.
      display: "inline-flex",
      ...getImageBackgroundColorStyles(theme),

      // Behavior when an image (node) is selected, at which point it can be deleted,
      // moved, etc.
      "&.ProseMirror-selectednode": {
        outline: `3px solid ${theme.palette.primary.main}`,
      },
    },

    "& hr": {
      borderWidth: 0,
      borderTopWidth: "thin",
      borderStyle: "solid",
      borderColor: theme.palette.text.secondary,

      "&.ProseMirror-selectednode": {
        borderColor: theme.palette.primary.main,
      },
    },

    "& table": {
      borderCollapse: "collapse",
      tableLayout: "fixed",
      // TODO(Steven DeMartini): Maybe we want to give the users a way to toggle the width of the
      // table to be 100% or not? Similar to what Confluence does with their "Responsive" option
      // width: "100%",
      margin: 0,
      overflowY: "hidden",
      // If we don't have enough horizontal space for a table (when in read-only mode),
      // we need it to add a horizontal scrollbar, which requires using display:block
      // instead of display:table.
      overflowX: "auto",
      display: "block",

      "& td, th": {
        minWidth: "1em",
        borderWidth: 1,
        borderStyle: "solid",
        borderColor:
          theme.palette.mode === "dark"
            ? theme.palette.grey[500]
            : theme.palette.grey[400],
        padding: "3px 5px",
        verticalAlign: "top",
        boxSizing: "border-box",
        position: "relative",

        "& > *": {
          marginBottom: 0,
        },
      },

      "& th": {
        fontWeight: 500,
        textAlign: "left",
        backgroundColor: theme.palette.action.selected,
      },
    },

    // When in editing mode, the <table> element is wrapped in a div with a
    // `tableWrapper` class. When we have that arrangement, we change how
    // overflow works on the table to instead overflow with the wrapper and
    // revert back to display:table, as we'd typically expect/want.
    "& .tableWrapper": {
      overflowX: "auto",

      "& table": {
        overflow: "hidden",
        display: "table",
      },
    },

    "& .selectedCell:after": {
      zIndex: Z_INDEXES.TABLE_ELEMENT,
      position: "absolute",
      content: '""',
      left: 0,
      right: 0,
      top: 0,
      bottom: 0,
      background: "rgba(200, 200, 255, 0.4)",
      pointerEvents: "none",
    },

    // Only when the editor has `editable` set to `true` should the table column
    // resize tools should be revealed and be usable
    '&[contenteditable="true"]': {
      "& .column-resize-handle": {
        position: "absolute",
        right: -2,
        top: -1,
        bottom: -2,
        width: 4,
        // This z-index proved necessary to ensure the handle sits above the
        // background of any cell (header and non-header)
        zIndex: Z_INDEXES.TABLE_ELEMENT,
        backgroundColor: theme.palette.primary.light,
        pointerEvents: "none",
      },

      "&.resize-cursor": {
        cursor: "col-resize",
      },
    },

    '&[contenteditable="false"]': {
      "& .column-resize-handle": {
        display: "none",
      },

      "&.resize-cursor": {
        // To ensure that users cannot resize tables when the editor is supposed
        // to be read-only, we have to disable pointer events for the entire
        // editor whenever the resize-cursor class is added (i.e. when a user
        // hovers over a column border that would otherwise allow for dragging
        // and resizing when in editable mode). This is because the underlying
        // prosemirror-tables `columnResizing` plugin doesn't know/care about
        // `editable` state, and so adds the "resize-cursor" class and tries to
        // listen for events regardless.
        pointerEvents: "none",
      },
    },

    // Based on the example styles from https://tiptap.dev/api/extensions/placeholder,
    // this adds the placeholder text at the top
    "& p.is-editor-empty:first-of-type::before": {
      color: theme.palette.text.disabled,
      content: "attr(data-placeholder)",
      float: "left",
      height: 0,
      pointerEvents: "none",
    },

    "& .ProseMirror-gapcursor:after": {
      // Override the default color provided for the Gapcursor extension (for better
      // dark/light mode compatibility)
      // https://github.com/ueberdosis/tiptap/blob/ab4a0e2507b4b92c46d293a0bb06bb00a04af6e0/packages/core/src/style.ts#L47
      borderColor: theme.palette.text.primary,
    },

    // These styles were based on Tiptap's example here
    // https://tiptap.dev/api/extensions/collaboration-cursor
    "& .collaboration-cursor__caret": {
      borderLeft: "1px solid #0d0d0d",
      borderRight: "1px solid #0d0d0d",
      marginLeft: "-1px",
      marginRight: "-1px",
      position: "relative",
      wordBreak: "normal",
      cursor: "text",

      // Add a larger dot at the top of the cursor, like Google Docs does, which helps
      // indicate that you can hover there and see the user's name label
      "&:after": {
        position: "absolute",
        content: '""',
        left: -3,
        right: 0,
        top: -2,
        borderWidth: 3,
        borderStyle: "solid",
        borderColor: "inherit",
      },

      // When hovering, show the user's name
      "&:hover .collaboration-cursor__label": {
        opacity: 1,
        // This transition will be used when fading in (after starting to hover), so
        // keep it brief and with no delay
        transition: theme.transitions.create("opacity", {
          delay: 0,
          duration: 100,
          easing: "linear",
        }),
      },
    },

    // Render the user name above the caret
    "& .collaboration-cursor__label": {
      borderRadius: "3px 3px 3px 0",
      color: "#0d0d0d",
      fontSize: 12,
      fontStyle: "normal",
      fontWeight: 600,
      // Make sure we always use our standard font and don't take on the font of an
      // element this is showing up inside of (like <code>)
      fontFamily: theme.typography.body1?.fontFamily ?? "initial",
      left: -1,
      lineHeight: "normal",
      padding: "0.1rem 0.3rem",
      position: "absolute",
      top: "-1.4em",
      userSelect: "none",
      whiteSpace: "nowrap",
      // Don't use pointer-events, since that will end up making the entire user name
      // surface part of the parent's hover zone and prevent interaction with content
      // behind it
      pointerEvents: "none",
      // Hide the user name by default, so we can transition it in when hovering over
      // the cursor caret
      opacity: 0,
      // This transition will be used when fading out after no longer hovering, so
      // delay it a bit longer than default so the name doesn't immediately disappear
      transition: theme.transitions.create("opacity", {
        delay: 500,
        duration: 100,
        easing: "linear",
      }),
      // So that we initially show the user name above the caret on first render
      // (e.g. when a user clicks to move their cursor, and on page load), use
      // an animation to delay updating the opacity. We'll then use transitions
      // based on :hover selectors (above) on the caret to let users view the
      // name again while hovering thereafter. We start at fully visible, then
      // fade out after the user would've had a chance to see/read the user
      // name.
      animation: `${cursorDelayOpacityChangeAnimation} 3s linear 1`,
    },
  };
}

/**
 * Get the background color styles to use for user-provided images being previewed.
 *
 * Useful for handling transparent images better in dark mode, since they typically
 * would have been created on a light-colored background context (e.g. may have black
 * text labels that wouldn't be readable in dark mode otherwise).
 */
export function getImageBackgroundColorStyles(theme: Pick<Theme, "palette">): {
  backgroundColor?: string;
  color?: string;
} {
  if (theme.palette.mode !== "dark") {
    // We only need to alter the colors in dark mode
    return {};
  }

  const backgroundColor = theme.palette.grey[200];
  return {
    // We add a light grey background to the image when in dark mode, similar to what
    // Chrome does in dark mode when viewing an image in its own tab. (Chrome uses a
    // background color of "hsl(0, 0%, 90%)", or equivalently "#e6e6e6".)
    backgroundColor,
    // The "alt text" of an image will be shown if it fails to render (e.g. for
    // tif or other file formats that can't be rendered in-browser, like with a
    // pending image upload), so make sure the font color is readable
    color: theme.palette.getContrastText(backgroundColor),
  };
}

const UTILITY_CLASS_PREFIX_DEFAULT = "MuiTiptap-";

/**
 * Get a utility class of the form "MuiTiptap-Foo-root" for the <Foo />
 * component and "root" (root element) slot.
 *
 * For convenience in users targeting certain CSS selectors to override
 * component styles, similar to what MUI does with its "Mui<Component>-<slot>"
 * classes (as described here
 * https://mui.com/material-ui/experimental-api/classname-generator/#setup and
 * somewhat here
 * https://mui.com/base-ui/getting-started/customization/#applying-custom-css-rules).
 *
 * A utility class is just used for targeting elements and overriding styles in
 * nested components (rather than us delivering CSS for the utility class
 * directly, since we instead use tss-react to generate CSS).
 */
export function getUtilityClass(componentName: string, slot: string): string {
  return `${UTILITY_CLASS_PREFIX_DEFAULT}${componentName}-${slot}`;
}

/**
 * Get a Record mapping each slot name for a component to its utility class for
 * that component.
 *
 * These returned utility classes are used for targeting and overriding styles
 * in nested components (rather than us delivering CSS for the utility classes
 * directly, since we instead use tss-react to generate CSS).
 *
 * Ex: {"root": "MuiTiptap-Foo-root"} for the <Foo /> component.
 */
export function getUtilityClasses<T extends string>(
  componentName: string,
  slots: T[],
): Record<T, string> {
  const result: Record<string, string> = {};

  slots.forEach((slot) => {
    result[slot] = getUtilityClass(componentName, slot);
  });

  return result;
}
