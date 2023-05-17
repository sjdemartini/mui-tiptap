import { MenuItem, Select, type SelectChangeEvent } from "@mui/material";
import type { Editor } from "@tiptap/core";
import { useCallback } from "react";
import { makeStyles } from "tss-react/mui";
import EditorMenuButtonTooltip from "./EditorMenuButtonTooltip";

type Props = {
  editor: Editor | null;
};

const useStyles = makeStyles({ name: { EditorMenuSelectOption } })({
  headingOption: {
    marginBlockStart: 0,
    marginBlockEnd: 0,
    fontWeight: "bold",
  },

  headingOption1: {
    fontSize: "1.4em",
  },

  headingOption2: {
    fontSize: "1.17em",
  },
});

// TODO(Steven DeMartini): replace `enum` here with object, per
// https://www.typescriptlang.org/docs/handbook/enums.html#objects-vs-enums for
// simpler value comparisons/handling below

enum HeadingOptionValue {
  Paragraph = "Paragraph",
  Heading1 = "Heading 1",
  Heading2 = "Heading 2",
  Heading3 = "Heading 3",
}
const HEADING_OPTION_VALUE_TO_LEVEL = {
  [HeadingOptionValue.Heading1]: 1,
  [HeadingOptionValue.Heading2]: 2,
  [HeadingOptionValue.Heading3]: 3,
} as const;
const LEVEL_TO_HEADING_OPTION_VALUE = {
  1: HeadingOptionValue.Heading1,
  2: HeadingOptionValue.Heading2,
  3: HeadingOptionValue.Heading3,
} as const;

export default function EditorMenuSelectOption({ editor }: Props) {
  const { classes, cx } = useStyles();
  const handleHeadingType: (
    event: SelectChangeEvent<"" | HeadingOptionValue>
  ) => void = useCallback(
    (event) => {
      const value = event.target.value;
      // eslint-disable-next-line @typescript-eslint/no-unsafe-enum-comparison
      if (value === HeadingOptionValue.Paragraph) {
        editor?.chain().setParagraph().focus().run();
      } else if (value in HEADING_OPTION_VALUE_TO_LEVEL) {
        editor
          ?.chain()
          .setHeading({
            level:
              HEADING_OPTION_VALUE_TO_LEVEL[
                value as keyof typeof HEADING_OPTION_VALUE_TO_LEVEL
              ],
          })
          .focus()
          .run();
      }
    },
    [editor]
  );

  let selectedValue: HeadingOptionValue | "" = "";
  if (editor?.isActive("paragraph")) {
    selectedValue = HeadingOptionValue.Paragraph;
  } else if (editor?.isActive("heading")) {
    const level = editor.getAttributes("heading").level as number | undefined;
    if (level && level in LEVEL_TO_HEADING_OPTION_VALUE) {
      selectedValue =
        LEVEL_TO_HEADING_OPTION_VALUE[
          level as keyof typeof LEVEL_TO_HEADING_OPTION_VALUE
        ];
    }
  }

  const isCurrentlyParagraphOrHeading = selectedValue !== "";
  const canSetParagraph = editor?.can().setParagraph();
  // We have to pass a level when running `can`, so this is just an arbitrary one
  const canSetHeading = editor?.can().setHeading({ level: 2 });

  return (
    // We currently have to specify that the value is of type `HeadingOptionValue | ""`
    // rather than just `HeadingOptionValue` due to the bug reported here
    // https://github.com/mui/material-ui/issues/34083. We need it to support "" as a
    // possible value in the `renderValue` function below since we have
    // `displayEmpty=true`, and the types don't properly handle that scenario.
    <Select<HeadingOptionValue | "">
      margin="none"
      variant="outlined"
      size="small"
      onChange={handleHeadingType}
      disabled={
        !isCurrentlyParagraphOrHeading && !canSetParagraph && !canSetHeading
      }
      displayEmpty
      renderValue={(selected) => {
        if (selected === "") {
          return <em>Change to text…</em>;
        }
        return selected;
      }}
      aria-label="Heading type"
      value={selectedValue}
      inputProps={{ sx: { py: "3px", fontSize: "0.9em" } }}
    >
      <MenuItem
        value={HeadingOptionValue.Paragraph}
        disabled={!isCurrentlyParagraphOrHeading && !canSetParagraph}
      >
        <EditorMenuButtonTooltip
          label=""
          shortcutKeys={["mod", "alt", "0"]}
          placement="right"
        >
          <span>Paragraph</span>
        </EditorMenuButtonTooltip>
      </MenuItem>
      <MenuItem value={HeadingOptionValue.Heading1} disabled={!canSetHeading}>
        <EditorMenuButtonTooltip
          label=""
          shortcutKeys={["mod", "alt", "1"]}
          placement="right"
        >
          <span className={cx(classes.headingOption, classes.headingOption1)}>
            {HeadingOptionValue.Heading1}
          </span>
        </EditorMenuButtonTooltip>
      </MenuItem>
      <MenuItem value={HeadingOptionValue.Heading2} disabled={!canSetHeading}>
        <EditorMenuButtonTooltip
          label=""
          shortcutKeys={["mod", "alt", "2"]}
          placement="right"
        >
          <span className={cx(classes.headingOption, classes.headingOption2)}>
            {HeadingOptionValue.Heading2}
          </span>
        </EditorMenuButtonTooltip>
      </MenuItem>

      <MenuItem value={HeadingOptionValue.Heading3} disabled={!canSetHeading}>
        <EditorMenuButtonTooltip
          label=""
          shortcutKeys={["mod", "alt", "3"]}
          placement="right"
        >
          <span className={classes.headingOption}>
            {HeadingOptionValue.Heading3}
          </span>
        </EditorMenuButtonTooltip>
      </MenuItem>
    </Select>
  );
}
