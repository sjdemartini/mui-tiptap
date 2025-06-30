import {
  InputRule,
  mergeAttributes,
  type ExtendedRegExpMatchArray,
  type NodeViewProps,
} from "@tiptap/core";
import { Image, type ImageOptions } from "@tiptap/extension-image";
import { ReactNodeViewRenderer } from "@tiptap/react";
import ResizableImageComponent from "./ResizableImageComponent";

export type ResizableImageOptions = ImageOptions & {
  /**
   * Return true if this is an img src we will permit to be created/rendered.
   *
   * If not provided, defaults to allowing all non-empty image `src` values.
   *
   * This option can be used to restrict which images are permitted. For
   * instance, this can be set such that only images from a certain set of
   * hostnames are allowed.
   */
  isAllowedImgSrc(src: string | null): boolean;

  /**
   * Optional React component to pass in as a child component to ResizableImage,
   * as a sibling placed after the img element.
   * This component will be rendered with the NodeViewProps passed from TipTap.
   */
  ChildComponent?: React.ElementType<NodeViewProps>;
};

/**
 * A modified version of Tiptap’s `Image` extension
 * (https://tiptap.dev/api/nodes/image), which adds the ability to resize images
 * directly in the editor. A drag handle appears in the bottom right when
 * clicking on an image, so users can interactively change the size.
 */
const ResizableImage = Image.extend<ResizableImageOptions>({
  addOptions() {
    return {
      // Tiptap claims this.parent can be undefined, so disable this eslint rule
      // https://tiptap.dev/guide/custom-extensions/#extend-existing-attributes
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
      ...this.parent?.(),

      // By default, allow all images where `src` is non-empty
      isAllowedImgSrc: (src: string | null) => {
        if (!src) {
          // The src field should be non-empty to be valid
          return false;
        }

        return true;
      },
    };
  },

  addAttributes() {
    return {
      ...this.parent?.(),

      // The `width` attribute will be used by users to override/specify the width of
      // the image. If not specified, the image will display with its default/full
      // width, up to a `max-width: 100%` (via CSS styles). Height will be set to
      // "auto", so `width` will always determine sizing and we'll preserve the original
      // aspect ratio.
      width: {
        default: null,
        // How to render this attribute in the HTML, so it's serialized/saved
        // (and in this case, affects visuals)
        renderHTML: (attributes) => ({
          width: attributes.width as string | number | undefined,
        }),
        // How to load this attribute from any existing HTML content
        parseHTML: (element) => element.getAttribute("width"),
      },

      // The `aspectRatio` attribute will be used to set the `aspect-ratio` CSS
      // style, which ensures that whatever the width (the specific value set
      // via attribute or max-width of 100%, if the viewport is narrower than
      // that), the "height: auto" can be inferred even before the image loads,
      // making the page flash/jitter less before/after the image renders (see
      // https://developer.mozilla.org/en-US/docs/Web/CSS/aspect-ratio, and note
      // that the newer alternative approach they describe using
      // `attr(width) / attr(height)` does not work in Chrome and other browsers
      // yet). We'll make sure to set `aspectRatio` whenever a user resizes and
      // sets `width`, so that we improve initial page/image rendering.
      aspectRatio: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.aspectRatio) {
            return {};
          }

          return {
            style: `aspect-ratio: ${attributes.aspectRatio as string}`,
          };
        },
        parseHTML: (element) => element.style.aspectRatio,
      },
    };
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "img",
      mergeAttributes(
        // Always render the `height="auto"` attribute by default, since we control the
        // width with resizing (and this maintains the image aspect ratio)
        {
          height: "auto",
        },
        this.options.HTMLAttributes,
        HTMLAttributes,
      ),
    ];
  },

  parseHTML() {
    return [
      {
        // This default tag-parsing rule is taken directly from the builtin Image
        // extension
        // (https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L61-L69)
        tag: this.options.allowBase64
          ? "img[src]"
          : 'img[src]:not([src^="data:"])',

        /**
         * We add `getAttrs` here to include our own additional conditions for
         * parsing/matching images from input HTML (where returning false marks it as
         * not "matching", therefore ignoring it and not creating an Image node in
         * prosemirror). See https://tiptap.dev/guide/custom-extensions#parse-html
         */
        getAttrs: (node) => {
          if (!(node instanceof Element)) {
            // This shouldn't be possible, since `getAttrs` with a `tag` should always
            // pass in a node, an per the rules above, it should be an HTML element.
            // Here for type-narrowing.
            return false;
          }

          // Check if this is an allowed image src, and return null if so to treat it as
          // a match. (Prosemirror expects null or undefined to be returned if the check
          // is successful
          // https://prosemirror.net/docs/ref/version/0.18.0.html#model.ParseRule.getAttrs.)
          const src = node.getAttribute("src");
          return this.options.isAllowedImgSrc(src) && null;
        },
      },
    ];
  },

  /**
   * By default, the Image extension supports markdown-like input rules for text entered
   * in the editor, such as the string "![wat](https://picsum.photos/600/400)". We'll
   * override the default implementation so that we can restrict which `src` values are
   * permitted.
   */
  addInputRules() {
    const parentInputRules = this.parent?.();
    if (!parentInputRules) {
      return [];
    }

    // This `getAttributes` definition comes from the default implementation here
    // https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L91-L95
    const getAttributes = (match: ExtendedRegExpMatchArray) => {
      const [, , alt, src, title] = match;
      return { src, alt, title };
    };

    // Unlike for `parseHTML` above, we can't simply override the `getAttributes`
    // function passed to `nodeInputRule`, since returning false there does not prevent
    // usage of the input rule (see
    // https://github.com/ueberdosis/tiptap/blob/f5c6fabbce534561cfe18012e48a5b6b406923bc/packages/core/src/inputRules/nodeInputRule.ts#L23).
    // Instead, we have to update the handler of the InputRule itself, which is
    // generated from the config passed to the `nodeInputRule`
    // (https://github.com/ueberdosis/tiptap/blob/4108e9f991522b5ac8f669ae2d24cfe9f91780ba/packages/extension-image/src/image.ts#L86-L98).
    // So iterate through each InputRule (should be just one in practice), and form an
    // alternate version which performs nothing if the image src is not permissable.
    return parentInputRules.map(
      (rule) =>
        new InputRule({
          find: rule.find,
          handler: (props) => {
            const attributes = getAttributes(props.match);
            if (!this.options.isAllowedImgSrc(attributes.src)) {
              // Skip this and don't transform the text into an Image
              return;
            }

            // Since the image src is valid, let the normal handler run
            return rule.handler(props);
          },
        }),
    );
  },

  addNodeView() {
    // In order to add interactive functionality for a user to resize the image
    // (and set the `width` attribute as it does so), use a Node View. See
    // https://tiptap.dev/guide/custom-extensions#node-views and
    // https://tiptap.dev/guide/node-views/react
    // @ts-expect-error Our ResizableImageComponent component overrides the
    // NodeViewProps to specify that the `node`'s `attrs` contains the
    // attributes added above and in the base Image extension (src, width,
    // aspectRatio, etc.), but `ReactNodeViewRenderer`'s type doesn't account
    // for this.
    return ReactNodeViewRenderer(ResizableImageComponent);
  },
});

export default ResizableImage;
