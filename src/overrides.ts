import type {
  ComponentsOverrides,
  ComponentsVariants,
  Theme as MuiTheme,
} from "@mui/material/styles";
import type { ControlledBubbleMenuProps } from "./ControlledBubbleMenu";
import type { ControlledBubbleMenuClassKey } from "./ControlledBubbleMenu.classes";
import type { FieldContainerProps } from "./FieldContainer";
import type { FieldContainerClassKey } from "./FieldContainer.classes";
import type { LinkBubbleMenuProps } from "./LinkBubbleMenu";
import type { LinkBubbleMenuClassKey } from "./LinkBubbleMenu/LinkBubbleMenu.classes";
import type { ViewLinkMenuContentProps } from "./LinkBubbleMenu/ViewLinkMenuContent";
import type { ViewLinkMenuContentClassKey } from "./LinkBubbleMenu/ViewLinkMenuContent.classes";
import type { MenuBarProps } from "./MenuBar";
import type { MenuBarClassKey } from "./MenuBar.classes";
import type { MenuDividerProps } from "./MenuDivider";
import type { MenuDividerClassKey } from "./MenuDivider.classes";
import type { RichTextContentProps } from "./RichTextContent";
import type { RichTextContentClassKey } from "./RichTextContent.classes";
import type { RichTextFieldProps } from "./RichTextField";
import type { RichTextFieldClassKey } from "./RichTextField.classes";
import type { TableBubbleMenuProps } from "./TableBubbleMenu";
import type { TableBubbleMenuClassKey } from "./TableBubbleMenu.classes";
import type { ColorPickerProps } from "./controls/ColorPicker";
import type { ColorPickerClassKey } from "./controls/ColorPicker.classes";
import type { ColorPickerPopperProps } from "./controls/ColorPickerPopper";
import type { ColorPickerPopperClassKey } from "./controls/ColorPickerPopper.classes";
import type { ColorSwatchButtonProps } from "./controls/ColorSwatchButton";
import type { ColorSwatchButtonClassKey } from "./controls/ColorSwatchButton.classes";
import type { MenuButtonProps } from "./controls/MenuButton";
import type { MenuButtonClassKey } from "./controls/MenuButton.classes";
import type { MenuButtonColorPickerProps } from "./controls/MenuButtonColorPicker";
import type { MenuButtonColorPickerClassKey } from "./controls/MenuButtonColorPicker.classes";
import type { MenuButtonTooltipProps } from "./controls/MenuButtonTooltip";
import type { MenuButtonTooltipClassKey } from "./controls/MenuButtonTooltip.classes";
import type { MenuControlsContainerProps } from "./controls/MenuControlsContainer";
import type { MenuControlsContainerClassKey } from "./controls/MenuControlsContainer.classes";
import type { MenuSelectProps } from "./controls/MenuSelect";
import type { MenuSelectClassKey } from "./controls/MenuSelect.classes";
import type { MenuSelectFontFamilyProps } from "./controls/MenuSelectFontFamily";
import type { MenuSelectFontFamilyClassKey } from "./controls/MenuSelectFontFamily.classes";
import type { MenuSelectFontSizeProps } from "./controls/MenuSelectFontSize";
import type { MenuSelectFontSizeClassKey } from "./controls/MenuSelectFontSize.classes";
import type { MenuSelectHeadingProps } from "./controls/MenuSelectHeading";
import type { MenuSelectHeadingClassKey } from "./controls/MenuSelectHeading.classes";
import type { MenuSelectTextAlignProps } from "./controls/MenuSelectTextAlign";
import type { MenuSelectTextAlignClassKey } from "./controls/MenuSelectTextAlign.classes";
import type { HeadingWithAnchorComponentProps } from "./extensions/HeadingWithAnchorComponent";
import type { HeadingWithAnchorComponentClassKey } from "./extensions/HeadingWithAnchorComponent.classes";
import type { ResizableImageComponentProps } from "./extensions/ResizableImageComponent";
import type { ResizableImageComponentClassKey } from "./extensions/ResizableImageComponent.classes";
import type { ResizableImageResizerProps } from "./extensions/ResizableImageResizer";
import type { ResizableImageResizerClassKey } from "./extensions/ResizableImageResizer.classes";

// Following
// https://mui.com/material-ui/customization/creating-themed-components/#typescript
// to allow TypeScript affordances for style overrides.

type Theme = Omit<MuiTheme, "components">;

declare module "@mui/material/styles" {
  interface ComponentNameToClassKey {
    MuiTiptapColorPicker: ColorPickerClassKey;
    MuiTiptapColorPickerPopper: ColorPickerPopperClassKey;
    MuiTiptapColorSwatchButton: ColorSwatchButtonClassKey;
    MuiTiptapControlledBubbleMenu: ControlledBubbleMenuClassKey;
    MuiTiptapFieldContainer: FieldContainerClassKey;
    MuiTiptapHeadingWithAnchorComponent: HeadingWithAnchorComponentClassKey;
    MuiTiptapLinkBubbleMenu: LinkBubbleMenuClassKey;
    MuiTiptapMenuBar: MenuBarClassKey;
    MuiTiptapMenuButton: MenuButtonClassKey;
    MuiTiptapMenuButtonColorPicker: MenuButtonColorPickerClassKey;
    MuiTiptapMenuButtonTooltip: MenuButtonTooltipClassKey;
    MuiTiptapMenuControlsContainer: MenuControlsContainerClassKey;
    MuiTiptapMenuDivider: MenuDividerClassKey;
    MuiTiptapMenuSelect: MenuSelectClassKey;
    MuiTiptapMenuSelectFontFamily: MenuSelectFontFamilyClassKey;
    MuiTiptapMenuSelectFontSize: MenuSelectFontSizeClassKey;
    MuiTiptapMenuSelectHeading: MenuSelectHeadingClassKey;
    MuiTiptapMenuSelectTextAlign: MenuSelectTextAlignClassKey;
    MuiTiptapResizableImageComponent: ResizableImageComponentClassKey;
    MuiTiptapResizableImageResizer: ResizableImageResizerClassKey;
    MuiTiptapRichTextContent: RichTextContentClassKey;
    MuiTiptapRichTextField: RichTextFieldClassKey;
    MuiTiptapTableBubbleMenu: TableBubbleMenuClassKey;
    MuiTiptapViewLinkMenuContent: ViewLinkMenuContentClassKey;
  }

  interface ComponentsPropsList {
    MuiTiptapColorPicker: Partial<ColorPickerProps>;
    MuiTiptapColorPickerPopper: Partial<ColorPickerPopperProps>;
    MuiTiptapColorSwatchButton: Partial<ColorSwatchButtonProps>;
    MuiTiptapControlledBubbleMenu: Partial<ControlledBubbleMenuProps>;
    MuiTiptapFieldContainer: Partial<FieldContainerProps>;
    MuiTiptapHeadingWithAnchorComponent: Partial<HeadingWithAnchorComponentProps>;
    MuiTiptapLinkBubbleMenu: Partial<LinkBubbleMenuProps>;
    MuiTiptapMenuBar: Partial<MenuBarProps>;
    MuiTiptapMenuButton: Partial<MenuButtonProps>;
    MuiTiptapMenuButtonColorPicker: Partial<MenuButtonColorPickerProps>;
    MuiTiptapMenuButtonTooltip: Partial<MenuButtonTooltipProps>;
    MuiTiptapMenuControlsContainer: Partial<MenuControlsContainerProps>;
    MuiTiptapMenuDivider: Partial<MenuDividerProps>;
    MuiTiptapMenuSelect: Partial<MenuSelectProps<unknown>>;
    MuiTiptapMenuSelectFontFamily: Partial<MenuSelectFontFamilyProps>;
    MuiTiptapMenuSelectFontSize: Partial<MenuSelectFontSizeProps>;
    MuiTiptapMenuSelectHeading: Partial<MenuSelectHeadingProps>;
    MuiTiptapMenuSelectTextAlign: Partial<MenuSelectTextAlignProps>;
    MuiTiptapResizableImageComponent: Partial<ResizableImageComponentProps>;
    MuiTiptapResizableImageResizer: Partial<ResizableImageResizerProps>;
    MuiTiptapRichTextContent: Partial<RichTextContentProps>;
    MuiTiptapRichTextField: Partial<RichTextFieldProps>;
    MuiTiptapTableBubbleMenu: Partial<TableBubbleMenuProps>;
    MuiTiptapViewLinkMenuContent: Partial<ViewLinkMenuContentProps>;
  }

  interface Components {
    MuiTiptapColorPicker?: {
      defaultProps?: ComponentsPropsList["MuiTiptapColorPicker"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapColorPicker"];
      variants?: ComponentsVariants["MuiTiptapColorPicker"];
    };
    MuiTiptapColorPickerPopper?: {
      defaultProps?: ComponentsPropsList["MuiTiptapColorPickerPopper"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapColorPickerPopper"];
      variants?: ComponentsVariants["MuiTiptapColorPickerPopper"];
    };
    MuiTiptapColorSwatchButton?: {
      defaultProps?: ComponentsPropsList["MuiTiptapColorSwatchButton"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapColorSwatchButton"];
      variants?: ComponentsVariants["MuiTiptapColorSwatchButton"];
    };
    MuiTiptapControlledBubbleMenu?: {
      defaultProps?: ComponentsPropsList["MuiTiptapControlledBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapControlledBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptapControlledBubbleMenu"];
    };
    MuiTiptapFieldContainer?: {
      defaultProps?: ComponentsPropsList["MuiTiptapFieldContainer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapFieldContainer"];
      variants?: ComponentsVariants["MuiTiptapFieldContainer"];
    };
    MuiTiptapHeadingWithAnchorComponent?: {
      defaultProps?: ComponentsPropsList["MuiTiptapHeadingWithAnchorComponent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapHeadingWithAnchorComponent"];
      variants?: ComponentsVariants["MuiTiptapHeadingWithAnchorComponent"];
    };
    MuiTiptapLinkBubbleMenu?: {
      defaultProps?: ComponentsPropsList["MuiTiptapLinkBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapLinkBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptapLinkBubbleMenu"];
    };
    MuiTiptapMenuBar?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuBar"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuBar"];
      variants?: ComponentsVariants["MuiTiptapMenuBar"];
    };
    MuiTiptapMenuButton?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuButton"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuButton"];
      variants?: ComponentsVariants["MuiTiptapMenuButton"];
    };
    MuiTiptapMenuButtonColorPicker?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuButtonColorPicker"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuButtonColorPicker"];
      variants?: ComponentsVariants["MuiTiptapMenuButtonColorPicker"];
    };
    MuiTiptapMenuButtonTooltip?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuButtonTooltip"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuButtonTooltip"];
      variants?: ComponentsVariants["MuiTiptapMenuButtonTooltip"];
    };
    MuiTiptapMenuControlsContainer?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuControlsContainer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuControlsContainer"];
      variants?: ComponentsVariants["MuiTiptapMenuControlsContainer"];
    };
    MuiTiptapMenuDivider?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuDivider"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuDivider"];
      variants?: ComponentsVariants["MuiTiptapMenuDivider"];
    };
    MuiTiptapMenuSelect?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuSelect"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuSelect"];
      variants?: ComponentsVariants["MuiTiptapMenuSelect"];
    };
    MuiTiptapMenuSelectFontFamily?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuSelectFontFamily"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuSelectFontFamily"];
      variants?: ComponentsVariants["MuiTiptapMenuSelectFontFamily"];
    };
    MuiTiptapMenuSelectFontSize?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuSelectFontSize"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuSelectFontSize"];
      variants?: ComponentsVariants["MuiTiptapMenuSelectFontSize"];
    };
    MuiTiptapMenuSelectHeading?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuSelectHeading"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuSelectHeading"];
      variants?: ComponentsVariants["MuiTiptapMenuSelectHeading"];
    };
    MuiTiptapMenuSelectTextAlign?: {
      defaultProps?: ComponentsPropsList["MuiTiptapMenuSelectTextAlign"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapMenuSelectTextAlign"];
      variants?: ComponentsVariants["MuiTiptapMenuSelectTextAlign"];
    };
    MuiTiptapResizableImageComponent?: {
      defaultProps?: ComponentsPropsList["MuiTiptapResizableImageComponent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapResizableImageComponent"];
      variants?: ComponentsVariants["MuiTiptapResizableImageComponent"];
    };
    MuiTiptapResizableImageResizer?: {
      defaultProps?: ComponentsPropsList["MuiTiptapResizableImageResizer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapResizableImageResizer"];
      variants?: ComponentsVariants["MuiTiptapResizableImageResizer"];
    };
    MuiTiptapRichTextContent?: {
      defaultProps?: ComponentsPropsList["MuiTiptapRichTextContent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapRichTextContent"];
      variants?: ComponentsVariants["MuiTiptapRichTextContent"];
    };
    MuiTiptapRichTextField?: {
      defaultProps?: ComponentsPropsList["MuiTiptapRichTextField"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapRichTextField"];
      variants?: ComponentsVariants["MuiTiptapRichTextField"];
    };
    MuiTiptapTableBubbleMenu?: {
      defaultProps?: ComponentsPropsList["MuiTiptapTableBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapTableBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptapTableBubbleMenu"];
    };
    MuiTiptapViewLinkMenuContent?: {
      defaultProps?: ComponentsPropsList["MuiTiptapViewLinkMenuContent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptapViewLinkMenuContent"];
      variants?: ComponentsVariants["MuiTiptapViewLinkMenuContent"];
    };
  }
}

// This empty export allows this file to be a module so we can import and
// include it in the build, to have the type augmentations available to
// consumers.
export {};
