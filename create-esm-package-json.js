// Create a `package.json` file in the `dist/esm` build output directory with
// {"type: "module"}, which should ensure that mui-tiptap can be imported
// properly as ESM in a node.js context (fixing
// https://github.com/sjdemartini/mui-tiptap/issues/256).
// See:
// - https://github.com/microsoft/TypeScript/issues/18442#issuecomment-1377529164
// - https://www.sensedeep.com/blog/posts/2021/how-to-create-single-source-npm-module.html
// - https://github.com/nodejs/node/issues/34515
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "dist", "esm");
const filePath = path.join(dir, "package.json");
const content = JSON.stringify({ type: "module" }, null, 2);

fs.writeFileSync(filePath, content, "utf8");

// Print the path relative to __dirname:
console.log(`Created ${path.relative(__dirname, filePath)}`);
