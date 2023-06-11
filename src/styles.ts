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
  TABLE_ELEMENT: 2,
  // The menu bar must sit higher than the table components (like the
  // column-resize-handle and selectedCells) of the editor.
  MENU_BAR: 3,
  // The bubble menus should appear on top of the menu bar
  BUBBLE_MENU: 4,
} as const;

/**
 * Return the number of pixels given a CSS pixel value. Ex: "16px" -> 16.
 *
 * Useful in Material-UI v5, since `theme.spacing()` returns a pixel string,
 * rather than a number.
 *
 * Inspired by this code within MUI:
 * https://github.com/mui-org/material-ui/blob/1884e7dd111a9d8336497c2e6667ad24f338dddd/packages/mui-lab/src/Masonry/Masonry.js#L15-L17
 */
export function parseToNumPixels(value: string): number {
  return Number(value.replace("px", ""));
}

export function getEditorStyles(theme: Theme): StyleRules {
  // Check whether the user has enabled responsive typography
  // (https://mui.com/material-ui/customization/typography/#responsive-font-sizes)
  const hasResponsiveStyles = Object.keys(theme.typography.h1).some((key) =>
    key.includes("@media")
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
      // since h1 and h2 are a bit too huge/dramatic. Instead, for we use h3-h6,
      // subtitle1, and subtitle2.

      // For h1, we take our usual font family, set a bold font weight, and set
      // the font size based on a scaled-up 20% increase to `typography.h4`
      // (which we use as our next smaller header). Note that if the MUI
      // `responsiveFontSizes` theme utility was used, we increase the font size
      // at all responsive breakpoints.
      fontFamily: theme.typography.h3.fontFamily,
      fontWeight: "bold",

      ...(hasResponsiveStyles
        ? {
            fontSize: `${1.5625 * 1.2}rem`,

            [theme.breakpoints.up("sm")]: {
              fontSize: `${1.8219 * 1.2}rem`,
            },

            [theme.breakpoints.up("md")]: {
              fontSize: `${2.0243 * 1.2}rem`,
            },

            [theme.breakpoints.up("lg")]: {
              fontSize: `${2.0243 * 1.2}rem`,
            },
          }
        : {
            fontSize: `${2.0243 * 1.2}rem`,
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
      display: "block",
      ...getImageBackgroundColorStyles(theme),

      // Behavior when an image (node) is selected, at which point it can be deleted,
      // moved, etc.
      "&.ProseMirror-selectednode": {
        outline: `3px solid ${theme.palette.primary.main}`,
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
        border: "1px solid",
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

    "& .column-resize-handle": {
      position: "absolute",
      right: -2,
      top: -1,
      bottom: -2,
      width: 4,
      // This z-index proved necessary to ensure the handle sits above the background of
      // any cell (header and non-header)
      zIndex: Z_INDEXES.TABLE_ELEMENT,
      backgroundColor: theme.palette.primary.light,
      pointerEvents: "none",
    },

    "&.resize-cursor": {
      cursor: "col-resize",
    },

    // When the editor has `editable` set to `false`, the table column resize
    // tools should be hidden
    '&[contenteditable="false"]': {
      "& .column-resize-handle": {
        display: "none",
      },

      "&.resize-cursor": {
        display: "none",
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
        borderColor: "inherit",
        border: "3px solid",
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
      fontFamily: theme.typography.body1.fontFamily,
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

// Paper components in dark mode in MUI v5 use a background-image to set the background "color"
// depending on the elevation of the Paper. As such, choosing `palette.background.paper` in dark
// mode will *not* match the paper background color if using elevation (the default). This is the
// color that matches the background-image's color when the total elevation is 1 (the Paper is on
// top of only the default background, with elevation=1), which is useful if we need "sticky" header
// placement in a scrolling container. See this issue
// https://github.com/mui/material-ui/issues/30468
export const DARK_MODE_PAPER_BACKGROUND_COLOR_ELEVATION_1 = "#1e1e1e";
// And similarly for elevation 2:
export const DARK_MODE_PAPER_BACKGROUND_COLOR_ELEVATION_2 = "#232323";
// An alternative to the above would be to copy the linear-gradient function for the
// background image that Paper uses, similar to what's suggested here
// https://github.com/mui/material-ui/issues/30468#issuecomment-1172034069 (and
// `getOverlayAlpha` *is* actually exported but just does not have TS definitions), and
// set the `background-image` to that linear gradient and `background-color` to
// theme.palette.background.paper, and get the same look as Paper. But it's a bit messy
// at the moment since it requires an untyped import and redefinition of the gradient.

/**
 * Get the background color styles to use for user-provided images being previewed.
 *
 * Useful for handling transparent images better in dark mode, since they typically
 * would have been created on a light-colored background context (e.g. may have black
 * text labels that wouldn't be readable in dark mode otherwise).
 */
export function getImageBackgroundColorStyles(theme: Theme): {
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
