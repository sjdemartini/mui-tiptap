<p align="center">
  <a href="https://github.com/sjdemartini/mui-tiptap" target="_blank">
    <img src="https://github.com/sjdemartini/mui-tiptap/assets/1647130/e1f01441-c74a-410c-b25d-5a58615d3e6a" alt="mui-tiptap logo" width="350" />
  </a>
</p>

<p align="center">
  <b>mui-tiptap</b>: A customizable <a href="https://mui.com/material-ui/getting-started/overview/">Material UI</a> styled WYSIWYG rich text editor, using <a href="https://tiptap.dev/">Tiptap</a>.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/mui-tiptap">
    <img alt="npm mui-tiptap package" src="https://img.shields.io/npm/v/mui-tiptap">
  </a>
  <a href="https://www.npmjs.com/package/mui-tiptap">
    <img alt="npm type definitions" src="https://img.shields.io/npm/types/mui-tiptap">
  </a>
  <a href="https://github.com/sjdemartini/mui-tiptap/actions">
    <img alt="GitHub Workflow Status" src="https://img.shields.io/github/actions/workflow/status/sjdemartini/mui-tiptap/build-test.yml">
  </a>
  <a href="https://github.com/sjdemartini/mui-tiptap/blob/main/LICENSE">
    <img alt="project license" src="https://img.shields.io/npm/l/mui-tiptap">
  </a>
</p>

- :sparkles: Styled based on your own MUI theme (colors, fonts, light vs dark mode, etc.)
- :hammer_and_wrench: Built on powerful Tiptap and ProseMirror foundations (extensible, real-time collaborative editing, cross-platform support, etc.)

**Features:**

- :toolbox: An all-in-one `RichTextEditor` component to get started immediately (no other components or hooks needed!), or individual modular components to customize to your needs
- :sunglasses: Built-in styles for Tiptap’s extensions (text formatting, lists, tables, Google Docs-like collaboration cursors; you name it!)
- :arrow_forward: Composable and extendable menu buttons and controls for the standard Tiptap extensions
- :framed_picture: `ResizableImage` extension for adding and resizing images directly in the editor
- :anchor: `HeadingWithAnchor` extension for dynamic GitHub-like anchor links for every heading you add
- :link: `LinkBubbleMenu` so adding and editing links is a breeze
- :white_square_button: `TableImproved` extension that [fixes](https://github.com/ueberdosis/tiptap/issues/2041) [problems](https://github.com/ueberdosis/tiptap/issues/2301) in the underlying Tiptap `Table` extension
- :pencil: `TableBubbleMenu` for interactively editing your rich text tables
- :building_construction: General-purpose `ControlledBubbleMenu` for building your own custom menus, [solving some shortcomings](https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146) of the Tiptap `BubbleMenu`
- And more!

<details>
<summary><b>README Table of Contents</b></summary>

- [Demo](#demo)
- [Installation](#installation)
- [Get started](#get-started)
  - [Use the all-in-one component](#use-the-all-in-one-component)
  - [Create and provide the `editor` yourself](#create-and-provide-the-editor-yourself)
  - [Render read-only rich text content](#render-read-only-rich-text-content)
- [Extensions and components](#extensions-and-components)
  - [Extensions](#extensions)
    - [`HeadingWithAnchor`](#headingwithanchor)
    - [`LinkBubbleMenuHandler`](#linkbubblemenuhandler)
    - [`ResizableImage`](#resizableimage)
    - [`TableImproved`](#tableimproved)
  - [Components](#components)
    - [Controls components](#controls-components)
- [Tips and suggestions](#tips-and-suggestions)
  - [Defining your editor `extensions`](#defining-your-editor-extensions)
- [Contributing](#contributing)

</details>

## Demo

Try it yourself in this **[CodeSandbox live demo](https://codesandbox.io/p/sandbox/mui-tiptap-demo-3zl2l6)**!

![mui-tiptap demo](https://github.com/sjdemartini/mui-tiptap/assets/1647130/a7d49a90-5730-4692-a83a-479a98018fb2)

## Installation

```shell
npm install mui-tiptap
```

or

```shell
yarn add mui-tiptap
```

There are peer dependencies on [`@mui/material`](https://www.npmjs.com/package/@mui/material) and [`@mui/icons-material`](https://www.npmjs.com/package/@mui/icons-material) (and their `@emotion/` peers), [`react-icons`](https://www.npmjs.com/package/react-icons), and [`@tiptap/`](https://tiptap.dev/installation/react) packages. These should be installed automatically by default if you’re using npm 7+ or pnpm. Otherwise, if your project doesn’t already use those, you can install them with:

```shell
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-icons @tiptap/react @tiptap/extension-heading @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table @tiptap/pm @tiptap/core
```

or

```shell
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled react-icons @tiptap/react @tiptap/extension-heading @tiptap/extension-image @tiptap/extension-link @tiptap/extension-table @tiptap/pm @tiptap/core
```

## Get started

### Use the all-in-one component

The simplest way to render a rich text editor is to use the `<RichTextEditor />` component:

```tsx
import { Button } from "@mui/material";
import StarterKit from "@tiptap/starter-kit";
import { RichTextEditor, type RichTextEditorRef } from "mui-tiptap";
import { useRef } from "react";

function App() {
  const rteRef = useRef<RichTextEditorRef>(null);

  return (
    <div>
      <RichTextEditor
        ref={rteRef}
        content="<p>Hello world</p>"
        extensions={[StarterKit]} // Or any extensions you wish!
      />

      <Button onClick={() => console.log(rteRef.current?.editor?.getHTML())}>
        Show HTML
      </Button>
    </div>
  );
}
```

Use its `renderControls` prop if you'd like to render buttons in a menu bar atop the editor (e.g., for toggling text styles, inserting a table, adding a link, and more). See [`src/demo/Editor.tsx`](./src/demo/Editor.tsx) for a more thorough example of this.

### Create and provide the `editor` yourself

If you need more customization, you can instead define your editor using Tiptap’s `useEditor` hook, and lay out your UI using a selection of `mui-tiptap` components (and/or your own components).

Pass the `editor` to `mui-tiptap`’s `<RichTextEditorProvider>` component at the top of your component tree. From there, provide whatever children to the provider that fit your needs.

The easiest is option is the `<RichTextField />` component, which is what `RichTextEditor` uses under the hood:

```tsx
import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import {
  MenuButtonBold,
  MenuButtonItalic,
  MenuControlsContainer,
  MenuDivider,
  MenuSelectHeading,
  RichTextEditorProvider,
  RichTextField,
} from "mui-tiptap";

function App() {
  const editor = useEditor({
    extensions: [StarterKit],
    content: "<p>Hello <b>world</b>!</p>",
  });
  return (
    <RichTextEditorProvider editor={editor}>
      <RichTextField
        controls={
          <MenuControlsContainer>
            <MenuSelectHeading />
            <MenuDivider />
            <MenuButtonBold />
            <MenuButtonItalic />
            {/* Add more controls of your choosing here */}
          </MenuControlsContainer>
        }
      />
    </RichTextEditorProvider>
  );
}
```

Or if you want full control over the UI, instead of `RichTextField`, you can build the editor area yourself and then just use the `<RichTextContent />` component where you want the (styled) editable rich text content to appear. `RichTextContent` is the MUI-themed version of Tiptap's `EditorContent` component.

### Render read-only rich text content

Use the `<RichTextReadOnly />` component and just pass in your HTML or ProseMirror JSON, like:

```tsx
<RichTextReadOnly content="<p>Hello world</p>" extensions=[...] />
```

This component will skip creating the Tiptap `editor` if `content` is empty, which can help performance.

## Extensions and components

### Extensions

#### `HeadingWithAnchor`

A modified version of [Tiptap’s `Heading` extension](https://tiptap.dev/api/nodes/heading), with dynamic GitHub-like anchor links for every heading you add. An anchor link button appear to the left of each heading when hovering over it, when the `editor` has `editable` set to `false`. This allows users to share links and jump to specific headings within your rendered editor content.

#### `LinkBubbleMenuHandler`

To be used in conjunction with the [`LinkBubbleMenu` component](#components), as this extension provides editor commands to control the state of the link bubble menu.

##### Commands <!-- omit from toc -->

- `openLinkBubbleMenu()`: Open/show the link bubble menu. Create a link if one doesn't exist at the current cursor selection, or edit the existing link if there is already a link at the current selection.
- `editLinkInBubbleMenu()`: Edit an existing link in the bubble menu, to be used when currently viewing a link in the already-opened bubble menu.
- `closeLinkBubbleMenu()`: Close/hide the link bubble menu, canceling any ongoing edits.

#### `ResizableImage`

A modified version of [Tiptap’s `Image` extension](https://tiptap.dev/api/nodes/image), which adds the ability to resize images directly in the editor. A drag handle appears in the bottom right when clicking on an image, so users can interactively change the size.

#### `TableImproved`

A modified version of [Tiptap’s `Table` extension](https://tiptap.dev/api/nodes/table) that fixes problems related to column-resizing and editable state.

Namely, this version of the extension, coupled with the `mui-tiptap` CSS styles ensures that:

1. Columns respect their resized widths even when the editor has `editable=false`
2. Column resizing is possible regardless of initial editor state, when toggling from `editable=false` to `editable=true`

(Resolves these reported Tiptap issues: [1](https://github.com/ueberdosis/tiptap/issues/2041), [2](https://github.com/ueberdosis/tiptap/issues/2301), [3](https://github.com/ueberdosis/tiptap/issues/4044).)

### Components

- `RichTextEditor`: An all-in-one component to directly render a MUI-styled Tiptap rich text editor field. Utilizes many of the below components internally. See the ["Get started" notes on usage above](#use-the-all-in-one-component). In brief:
  ```tsx
  <RichTextEditor ref={rteRef} content="<p>Hello world</p>" extensions={[...]} />
  ```
- `RichTextReadOnly`: An all-in-one component to directly render read-only Tiptap editor content. While `RichTextEditor` (or `useEditor`, `RichTextEditorProvider`, and `RichTextContent`) can be used as read-only via the editor's `editable` prop, this is a simpler and more efficient version that only renders content and nothing more (e.g., does not instantiate a toolbar, bubble menu, etc. that you probably wouldn’t want in a read-only context, and it skips instantiating the editor at all if there's no content to display).
- `RichTextEditorProvider`: uses React context to make the Tiptap `editor` available to any nested components so that the `editor` does not need to be manually passed in at every level. Required as a parent for most mui-tiptap components besides the all-in-one `RichTextEditor` and `RichTextReadOnly`. Utilize the provided `editor` in your own components via the `useRichTextEditorContext()` hook.
- `RichTextField`: Renders the Tiptap rich text editor content and a controls menu bar. With the `"outlined"` variant, renders a bordered UI similar to the Material UI `TextField`. The `"standard"` variant does not have an outline/border.
- `MenuBar`: A collapsible, optionally-sticky container for showing editor controls atop the editor content. (This component is used to contain `RichTextEditor`’s `renderControls` and `RichTextField`’s `controls`, but can be used directly if you’re doing something more custom.)
- `RichTextContent`: Renders a Material UI styled version of Tiptap rich text editor content. Applies all CSS rules for formatting, as a styled alternative to Tiptap’s `<EditorContent />` component. (Used automatically within `RichTextEditor` and `RichTextField`.)
- `LinkBubbleMenu`: Renders a bubble menu when viewing, creating, or editing a link. Requires the [`LinkBubbleMenuHandler` extension](#linkbubblemenuhandler). Pairs well with the [`<MenuButtonEditLink />` component](#controls-components). Render the `<LinkBubbleMenu />` in the same context as your `RichTextField` or `RichTextContent` (the bubble menu itself will be positioned appropriately no matter where it appears), or if you're using `RichTextEditor`, this component be included via the `children` render-prop. See [`src/demo/Editor.tsx`](./src/demo/Editor.tsx) for an example of this.
- `TableBubbleMenu`: Renders a bubble menu to manipulate the contents of a Table (add or delete columns or rows, merge cells, etc.), when the user's caret/selection is inside a Table. For use with [mui-tiptap’s `TableImproved` extension](#tableimproved) or Tiptap’s `@tiptap/extension-table` extension.
- `TableMenuControls`: Used internally by `TableBubbleMenu` for the set of controls. Available if you require an alternative UI to the bubble menu.
- `ControlledBubbleMenu`: General-purpose component for building your own custom bubble menus, [solving some shortcomings](https://github.com/ueberdosis/tiptap/issues/2305#issuecomment-1020665146) of [Tiptap’s `BubbleMenu`](https://tiptap.dev/api/extensions/bubble-menu). This is what both `LinkBubbleMenu` and `TableBubbleMenu` use under the hood.

#### Controls components

These controls components to help you quickly put together your menu bar.

You can override all props for these components (e.g. to change the icon, tooltip label, shortcut keys shown, `onClick` behavior, etc.). Or easily create controls for your own extensions and use-cases with the base `MenuButton` and `MenuSelect` components.

| Extension                                                                                                                          | `mui-tiptap` component(s)                                                                                                                                               |
| ---------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [`@tiptap/extension-blockquote`](https://tiptap.dev/api/nodes/blockquote)                                                          | `MenuButtonBlockquote`                                                                                                                                                  |
| [`@tiptap/extension-bold`](https://tiptap.dev/api/marks/bold)                                                                      | `MenuButtonBold`                                                                                                                                                        |
| [`@tiptap/extension-bullet-list`](https://tiptap.dev/api/nodes/bullet-list)                                                        | `MenuButtonBulletedList`                                                                                                                                                |
| [`@tiptap/extension-code`](https://tiptap.dev/api/marks/code)                                                                      | `MenuButtonCode`                                                                                                                                                        |
| [`@tiptap/extension-code-block`](https://tiptap.dev/api/nodes/code-block)                                                          | `MenuButtonCodeBlock`                                                                                                                                                   |
| mui-tiptap’s [`HeadingWithAnchor`](#headingwithanchor)<br />or [`@tiptap/extension-heading`](https://tiptap.dev/api/nodes/heading) | `MenuSelectHeading`                                                                                                                                                     |
| [`@tiptap/extension-history`](https://tiptap.dev/api/extensions/history)                                                           | `MenuButtonRedo`, `MenuButtonUndo`                                                                                                                                      |
| [`@tiptap/extension-horizontal-rule`](https://tiptap.dev/api/nodes/horizontal-rule)                                                | `MenuButtonHorizontalRule`                                                                                                                                              |
| mui-tiptap’s [`ResizableImage`](#resizableimage)<br />or [`@tiptap/extension-image`](https://tiptap.dev/api/nodes/image)           | `MenuButtonAddImage`                                                                                                                                                    |
| [`@tiptap/extension-italic`](https://tiptap.dev/api/marks/italic)                                                                  | `MenuButtonItalic`                                                                                                                                                      |
| [`@tiptap/extension-link`](https://tiptap.dev/api/marks/link)                                                                      | `MenuButtonEditLink` (requires the `mui-tiptap` [`LinkBubbleMenuHandler` extension](#linkbubblemenuhandler) and [`<LinkBubbleMenu />` component](#components))          |
| [`@tiptap/extension-list-item`](https://tiptap.dev/api/nodes/list-item)                                                            | `MenuButtonIndent`, `MenuButtonUnindent`                                                                                                                                |
| [`@tiptap/extension-ordered-list`](https://tiptap.dev/api/nodes/ordered-list)                                                      | `MenuButtonOrderedList`                                                                                                                                                 |
| [`@tiptap/extension-paragraph`](https://tiptap.dev/api/nodes/paragraph)                                                            | `MenuSelectHeading`                                                                                                                                                     |
| [`@tiptap/extension-strike`](https://tiptap.dev/api/marks/strike)                                                                  | `MenuButtonStrikethrough`                                                                                                                                               |
| [`@tiptap/extension-subscript`](https://tiptap.dev/api/marks/subscript)                                                            | `MenuButtonSubscript`                                                                                                                                                   |
| [`@tiptap/extension-superscript`](https://tiptap.dev/api/marks/superscript)                                                        | `MenuButtonSuperscript`                                                                                                                                                 |
| mui-tiptap’s [`TableImproved`](#tableimproved)<br />or [`@tiptap/extension-table`](https://tiptap.dev/api/nodes/table)             | `MenuButtonAddTable`                                                                                                                                                    |
| [`@tiptap/extension-task-list`](https://tiptap.dev/api/nodes/task-list)                                                            | `MenuButtonTaskList`                                                                                                                                                    |
| [`@tiptap/extension-text-align`](https://tiptap.dev/api/extensions/text-align)                                                     | `MenuSelectTextAlign` (all-in-one select)<br />or `MenuButtonAlignLeft`, `MenuButtonAlignCenter`, `MenuButtonAlignRight`, `MenuButtonAlignJustify` (individual buttons) |
| [`@tiptap/extension-underline`](https://tiptap.dev/api/marks/underline)                                                            | `MenuButtonUnderline`                                                                                                                                                   |

**Other components:**

- `MenuButtonRemoveFormatting`: a control button that removes all inline formatting of marks (calling Tiptap’s [`unsetAllMarks()`](https://tiptap.dev/api/commands/unset-all-marks))
- `MenuDivider`: renders a vertical line divider to separate different sections of your menu bar and implicitly group separate controls.
- `MenuControlsContainer`: provides consistent spacing between different editor controls components provided as `children`.

Typically you will define your controls (for `RichTextEditor`’s `renderControls` or `RichTextField`’s `controls`) like:

```tsx
<MenuControlsContainer>
  <MenuSelectHeading />
  <MenuDivider />
  <MenuButtonBold />
  <MenuButtonItalic />
  {/* Add more controls of your choosing here */}
</MenuControlsContainer>
```

## Tips and suggestions

### Defining your editor `extensions`

[Browse Tiptap extensions](https://tiptap.dev/extensions).

Extensions that need to be higher precedence (for their keyboard shortcuts, etc.) should come **later** in your extensions array. (See Tiptap's general notes on extension plugin precedence and ordering [here](https://github.com/ueberdosis/tiptap/issues/1547#issuecomment-890848888).) For example:

- Put the `TableImproved` (or `Table`) extension first in the array.
  - As [noted](https://github.com/ProseMirror/prosemirror-tables/blob/b6054a0316dc60cda0f7065e186cfacf6d93519c/src/index.ts#L78-L82) in the underlying `prosemirror-tables` package, the table editing plugin should have the lowest precedence, since it depends on key and mouse events but other plugins will likely need to take handle those first. For instance, if you want to indent or dedent a list item inside a table, you should be able to do that by pressing tab, and tab should only move between table cells if not within such a nested node.
- Put the `Blockquote` extension after the `Bold` extension, so `Blockquote`’s keyboard shortcut takes precedence.
  - Otherwise, the keyboard shortcut for `Blockquote` (Cmd+Shift+B) will mistakenly toggle the bold mark (due to its “overlapping” Cmd+b shortcut). (See related Tiptap issues [here](https://github.com/ueberdosis/tiptap/issues/4005) and [here](https://github.com/ueberdosis/tiptap/issues/4006).)
- Put the `Mention` extension after list-related extensions (`TaskList`, `TaskItem`, `BulletList`, `OrderedList`, `ListItem`, etc.) so that pressing "Enter" on a mention suggestion will select it, rather than create a new list item (when trying to @mention something within an existing list item).

Other extension tips:

- If you'd like `Subscript` and `Superscript` extensions to be mutually exclusive, so that text can't be both superscript and subscript simultaneously, use the `excludes` configuration parameter to exclude each other.

  - As described in [this Tiptap issue](https://github.com/ueberdosis/tiptap/pull/1436#issuecomment-1031937768). For instance:

    ```ts
    const CustomSubscript = Subscript.extend({
      excludes: "superscript",
    });
    const CustomSuperscript = Superscript.extend({
      excludes: "subscript",
    });
    ```

## Contributing

Get started [here](./CONTRIBUTING.md).
