<p align="center">
  <img src="https://github.com/sjdemartini/mui-tiptap/assets/1647130/e1f01441-c74a-410c-b25d-5a58615d3e6a" alt="mui-tiptap-logo" width="350" />
</p>

<p align="center">
  <b>mui-tiptap</b>: A customizable <a href="https://mui.com/material-ui/getting-started/overview/">Material-UI (MUI)</a> styled WYSIWYG rich text editor, using <a href="https://tiptap.dev/">Tiptap</a>.
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
    <img src="https://img.shields.io/npm/l/mui-tiptap">
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

To use the all-in-one component:

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

## Tips and suggestions

### Defining your editor `extensions`

- Put the `TableImproved` (or `Table`) extension first in the array.
  - As [noted](https://github.com/ProseMirror/prosemirror-tables/blob/b6054a0316dc60cda0f7065e186cfacf6d93519c/src/index.ts#L78-L82) in the underlying `prosemirror-tables` package, the table editing plugin should have the lowest precedence, since it depends on key and mouse events but other plugins will likely need to take handle those first. For instance, if you want to indent or dedent a list item inside a table, you should be able to do that by pressing tab, and tab should only move between table cells if not within such a nested node.
- Put the `Blockquote` extension after the `Bold` extension, so `Blockquote`’s keyboard shortcut takes precedence.
  - Otherwise, the keyboard shortcut for `Blockquote` (Cmd+Shift+B) will mistakenly toggle the bold mark (due to its “overlapping” Cmd+b shortcut). (See related Tiptap issues [here](https://github.com/ueberdosis/tiptap/issues/4005) and [here](https://github.com/ueberdosis/tiptap/issues/4006).)
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

(See Tiptap's general notes on extension plugin precedence and ordering [here](https://github.com/ueberdosis/tiptap/issues/1547#issuecomment-890848888).)

**🚧 More documentation coming soon!**
