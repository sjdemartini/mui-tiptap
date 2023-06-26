import MenuDivider from "../MenuDivider";
import { useRichTextEditorContext } from "../context";
import MenuButtonAddImage from "../controls/MenuButtonAddImage";
import MenuButtonAddTable from "../controls/MenuButtonAddTable";
import MenuButtonBlockquote from "../controls/MenuButtonBlockquote";
import MenuButtonBold from "../controls/MenuButtonBold";
import MenuButtonBulletedList from "../controls/MenuButtonBulletedList";
import MenuButtonCode from "../controls/MenuButtonCode";
import MenuButtonCodeBlock from "../controls/MenuButtonCodeBlock";
import MenuButtonEditLink from "../controls/MenuButtonEditLink";
import MenuButtonHorizontalRule from "../controls/MenuButtonHorizontalRule";
import MenuButtonIndent from "../controls/MenuButtonIndent";
import MenuButtonItalic from "../controls/MenuButtonItalic";
import MenuButtonOrderedList from "../controls/MenuButtonOrderedList";
import MenuButtonRedo from "../controls/MenuButtonRedo";
import MenuButtonRemoveFormatting from "../controls/MenuButtonRemoveFormatting";
import MenuButtonStrikethrough from "../controls/MenuButtonStrikethrough";
import MenuButtonSubscript from "../controls/MenuButtonSubscript";
import MenuButtonSuperscript from "../controls/MenuButtonSuperscript";
import MenuButtonTaskList from "../controls/MenuButtonTaskList";
import MenuButtonUnderline from "../controls/MenuButtonUnderline";
import MenuButtonUndo from "../controls/MenuButtonUndo";
import MenuButtonUnindent from "../controls/MenuButtonUnindent";
import MenuControlsContainer from "../controls/MenuControlsContainer";
import MenuHeadingSelect from "../controls/MenuHeadingSelect";
import { isTouchDevice } from "../utils/platform";

export default function EditorMenuControls() {
  const editor = useRichTextEditorContext();
  return (
    <MenuControlsContainer>
      <MenuHeadingSelect />

      <MenuButtonBold />

      <MenuButtonItalic />

      <MenuButtonUnderline />

      <MenuButtonStrikethrough />

      <MenuButtonSubscript />

      <MenuButtonSuperscript />

      <MenuDivider />

      <MenuButtonEditLink />

      <MenuDivider />

      <MenuButtonOrderedList />

      <MenuButtonBulletedList />

      <MenuButtonTaskList />

      {/* On touch devices, we'll show indent/unindent buttons, since they're
      unlikely to have a keyboard that will allow for using Tab/Shift+Tab. These
      buttons probably aren't necessary for keyboard users and would add extra
      clutter. */}
      {isTouchDevice() && (
        <>
          <MenuButtonIndent />

          <MenuButtonUnindent />
        </>
      )}

      <MenuDivider />

      <MenuButtonBlockquote />

      <MenuDivider />

      <MenuButtonCode />

      <MenuButtonCodeBlock />

      <MenuDivider />

      <MenuButtonAddImage
        onClick={() => {
          const url = window.prompt("Image URL");

          if (url) {
            editor?.chain().focus().setImage({ src: url }).run();
          }
        }}
      />

      <MenuDivider />

      <MenuButtonHorizontalRule />

      <MenuButtonAddTable />

      <MenuDivider />

      <MenuButtonRemoveFormatting />

      <MenuDivider />

      <MenuButtonUndo />
      <MenuButtonRedo />
    </MenuControlsContainer>
  );
}
