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
import type { MenuSelectLineHeightProps } from "./controls/MenuSelectLineHeight";
import type { MenuSelectLineHeightClassKey } from "./controls/MenuSelectLineHeight.classes";
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
    "MuiTiptap-ColorPicker": ColorPickerClassKey;
    "MuiTiptap-ColorPickerPopper": ColorPickerPopperClassKey;
    "MuiTiptap-ColorSwatchButton": ColorSwatchButtonClassKey;
    "MuiTiptap-ControlledBubbleMenu": ControlledBubbleMenuClassKey;
    "MuiTiptap-FieldContainer": FieldContainerClassKey;
    "MuiTiptap-HeadingWithAnchorComponent": HeadingWithAnchorComponentClassKey;
    "MuiTiptap-LinkBubbleMenu": LinkBubbleMenuClassKey;
    "MuiTiptap-MenuBar": MenuBarClassKey;
    "MuiTiptap-MenuButton": MenuButtonClassKey;
    "MuiTiptap-MenuButtonColorPicker": MenuButtonColorPickerClassKey;
    "MuiTiptap-MenuButtonTooltip": MenuButtonTooltipClassKey;
    "MuiTiptap-MenuControlsContainer": MenuControlsContainerClassKey;
    "MuiTiptap-MenuDivider": MenuDividerClassKey;
    "MuiTiptap-MenuSelect": MenuSelectClassKey;
    "MuiTiptap-MenuSelectFontFamily": MenuSelectFontFamilyClassKey;
    "MuiTiptap-MenuSelectFontSize": MenuSelectFontSizeClassKey;
    "MuiTiptap-MenuSelectHeading": MenuSelectHeadingClassKey;
    "MuiTiptap-MenuSelectLineHeight": MenuSelectLineHeightClassKey;
    "MuiTiptap-MenuSelectTextAlign": MenuSelectTextAlignClassKey;
    "MuiTiptap-ResizableImageComponent": ResizableImageComponentClassKey;
    "MuiTiptap-ResizableImageResizer": ResizableImageResizerClassKey;
    "MuiTiptap-RichTextContent": RichTextContentClassKey;
    "MuiTiptap-RichTextField": RichTextFieldClassKey;
    "MuiTiptap-TableBubbleMenu": TableBubbleMenuClassKey;
    "MuiTiptap-ViewLinkMenuContent": ViewLinkMenuContentClassKey;
  }

  interface ComponentsPropsList {
    "MuiTiptap-ColorPicker": Partial<ColorPickerProps>;
    "MuiTiptap-ColorPickerPopper": Partial<ColorPickerPopperProps>;
    "MuiTiptap-ColorSwatchButton": Partial<ColorSwatchButtonProps>;
    "MuiTiptap-ControlledBubbleMenu": Partial<ControlledBubbleMenuProps>;
    "MuiTiptap-FieldContainer": Partial<FieldContainerProps>;
    "MuiTiptap-HeadingWithAnchorComponent": Partial<HeadingWithAnchorComponentProps>;
    "MuiTiptap-LinkBubbleMenu": Partial<LinkBubbleMenuProps>;
    "MuiTiptap-MenuBar": Partial<MenuBarProps>;
    "MuiTiptap-MenuButton": Partial<MenuButtonProps>;
    "MuiTiptap-MenuButtonColorPicker": Partial<MenuButtonColorPickerProps>;
    "MuiTiptap-MenuButtonTooltip": Partial<MenuButtonTooltipProps>;
    "MuiTiptap-MenuControlsContainer": Partial<MenuControlsContainerProps>;
    "MuiTiptap-MenuDivider": Partial<MenuDividerProps>;
    "MuiTiptap-MenuSelect": Partial<MenuSelectProps<unknown>>;
    "MuiTiptap-MenuSelectFontFamily": Partial<MenuSelectFontFamilyProps>;
    "MuiTiptap-MenuSelectFontSize": Partial<MenuSelectFontSizeProps>;
    "MuiTiptap-MenuSelectHeading": Partial<MenuSelectHeadingProps>;
    "MuiTiptap-MenuSelectLineHeight": Partial<MenuSelectLineHeightProps>;
    "MuiTiptap-MenuSelectTextAlign": Partial<MenuSelectTextAlignProps>;
    "MuiTiptap-ResizableImageComponent": Partial<ResizableImageComponentProps>;
    "MuiTiptap-ResizableImageResizer": Partial<ResizableImageResizerProps>;
    "MuiTiptap-RichTextContent": Partial<RichTextContentProps>;
    "MuiTiptap-RichTextField": Partial<RichTextFieldProps>;
    "MuiTiptap-TableBubbleMenu": Partial<TableBubbleMenuProps>;
    "MuiTiptap-ViewLinkMenuContent": Partial<ViewLinkMenuContentProps>;
  }

  interface Components {
    "MuiTiptap-ColorPicker"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ColorPicker"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ColorPicker"];
      variants?: ComponentsVariants["MuiTiptap-ColorPicker"];
    };
    "MuiTiptap-ColorPickerPopper"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ColorPickerPopper"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ColorPickerPopper"];
      variants?: ComponentsVariants["MuiTiptap-ColorPickerPopper"];
    };
    "MuiTiptap-ColorSwatchButton"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ColorSwatchButton"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ColorSwatchButton"];
      variants?: ComponentsVariants["MuiTiptap-ColorSwatchButton"];
    };
    "MuiTiptap-ControlledBubbleMenu"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ControlledBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ControlledBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptap-ControlledBubbleMenu"];
    };
    "MuiTiptap-FieldContainer"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-FieldContainer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-FieldContainer"];
      variants?: ComponentsVariants["MuiTiptap-FieldContainer"];
    };
    "MuiTiptap-HeadingWithAnchorComponent"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-HeadingWithAnchorComponent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-HeadingWithAnchorComponent"];
      variants?: ComponentsVariants["MuiTiptap-HeadingWithAnchorComponent"];
    };
    "MuiTiptap-LinkBubbleMenu"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-LinkBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-LinkBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptap-LinkBubbleMenu"];
    };
    "MuiTiptap-MenuBar"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuBar"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuBar"];
      variants?: ComponentsVariants["MuiTiptap-MenuBar"];
    };
    "MuiTiptap-MenuButton"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuButton"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuButton"];
      variants?: ComponentsVariants["MuiTiptap-MenuButton"];
    };
    "MuiTiptap-MenuButtonColorPicker"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuButtonColorPicker"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuButtonColorPicker"];
      variants?: ComponentsVariants["MuiTiptap-MenuButtonColorPicker"];
    };
    "MuiTiptap-MenuButtonTooltip"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuButtonTooltip"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuButtonTooltip"];
      variants?: ComponentsVariants["MuiTiptap-MenuButtonTooltip"];
    };
    "MuiTiptap-MenuControlsContainer"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuControlsContainer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuControlsContainer"];
      variants?: ComponentsVariants["MuiTiptap-MenuControlsContainer"];
    };
    "MuiTiptap-MenuDivider"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuDivider"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuDivider"];
      variants?: ComponentsVariants["MuiTiptap-MenuDivider"];
    };
    "MuiTiptap-MenuSelect"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelect"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelect"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelect"];
    };
    "MuiTiptap-MenuSelectFontFamily"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelectFontFamily"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelectFontFamily"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelectFontFamily"];
    };
    "MuiTiptap-MenuSelectFontSize"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelectFontSize"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelectFontSize"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelectFontSize"];
    };
    "MuiTiptap-MenuSelectHeading"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelectHeading"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelectHeading"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelectHeading"];
    };
    "MuiTiptap-MenuSelectLineHeight"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelectLineHeight"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelectLineHeight"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelectLineHeight"];
    };
    "MuiTiptap-MenuSelectTextAlign"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-MenuSelectTextAlign"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-MenuSelectTextAlign"];
      variants?: ComponentsVariants["MuiTiptap-MenuSelectTextAlign"];
    };
    "MuiTiptap-ResizableImageComponent"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ResizableImageComponent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ResizableImageComponent"];
      variants?: ComponentsVariants["MuiTiptap-ResizableImageComponent"];
    };
    "MuiTiptap-ResizableImageResizer"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ResizableImageResizer"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ResizableImageResizer"];
      variants?: ComponentsVariants["MuiTiptap-ResizableImageResizer"];
    };
    "MuiTiptap-RichTextContent"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-RichTextContent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-RichTextContent"];
      variants?: ComponentsVariants["MuiTiptap-RichTextContent"];
    };
    "MuiTiptap-RichTextField"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-RichTextField"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-RichTextField"];
      variants?: ComponentsVariants["MuiTiptap-RichTextField"];
    };
    "MuiTiptap-TableBubbleMenu"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-TableBubbleMenu"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-TableBubbleMenu"];
      variants?: ComponentsVariants["MuiTiptap-TableBubbleMenu"];
    };
    "MuiTiptap-ViewLinkMenuContent"?: {
      defaultProps?: ComponentsPropsList["MuiTiptap-ViewLinkMenuContent"];
      styleOverrides?: ComponentsOverrides<Theme>["MuiTiptap-ViewLinkMenuContent"];
      variants?: ComponentsVariants["MuiTiptap-ViewLinkMenuContent"];
    };
  }
}
