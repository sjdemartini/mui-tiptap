import { TableCell } from "@tiptap/extension-table-cell";

const TableCellImproved = TableCell.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			borderStyle: {
				default: null,
				renderHTML: (attributes) => {
					if (!attributes.borderStyle) {
						return {}
					}

					return {
						style: `border-style: ${attributes.borderStyle}`,
					}
				},
				parseHTML: (element) => {
					return element.style.borderStyle.replace(/['"]+/g, '')
				},
			},
		}
	},
})

export default TableCellImproved
