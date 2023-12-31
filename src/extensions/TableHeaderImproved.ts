import { TableHeader } from "@tiptap/extension-table-header";

const TableHeaderImproved = TableHeader.extend({
  addAttributes() {
    return {
      ...this.parent?.(),
      borderStyle: {
        default: null,
        renderHTML: (attributes) => {
          if (!attributes.borderStyle) {
            return {};
          }

          return {
            style: `border-style: ${attributes.borderStyle as string}`,
          };
        },
        parseHTML: (element) => {
          return element.style.borderStyle.replace(/['"]+/g, "");
        },
      },
    };
  },
});

export default TableHeaderImproved;
