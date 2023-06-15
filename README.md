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

There are peer dependencies on [`@mui/material`](https://www.npmjs.com/package/@mui/material) and [`@mui/icons-material`](https://www.npmjs.com/package/@mui/icons-material) (and their `@emotion/` peers), [`react-icons`](https://www.npmjs.com/package/react-icons), and [`@tiptap/`](https://tiptap.dev/installation/react) packages. If your project doesn’t already use those, you can install them with:

```shell
npm install @mui/material @mui/icons-material @emotion/react @emotion/styled react-icons @tiptap/react @tiptap/pm @tiptap/starter-kit
```

or

```shell
yarn add @mui/material @mui/icons-material @emotion/react @emotion/styled react-icons @tiptap/react @tiptap/pm @tiptap/starter-kit
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

**🚧 More documentation coming soon!**
