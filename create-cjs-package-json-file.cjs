// Create a `package.json` file in the `dist/cjs` build output directory with
// {"type: "commonjs"}, which should ensure that mui-tiptap can be imported
// properly as CJS, despite our main package.json file using "type": "module",
// since we compile to tsc which uses `.js` file extensions and not `.cjs`,
// hence the need for the package.json specification (see
// https://github.com/nodejs/node/issues/34515).
const fs = require("fs");
const path = require("path");

const dir = path.join(__dirname, "dist", "cjs");
const filePath = path.join(dir, "package.json");
const content = JSON.stringify({ type: "commonjs" }, null, 2);

fs.writeFileSync(filePath, content, "utf8");

// Print the path relative to __dirname:
console.log(`Created ${path.relative(__dirname, filePath)}`);
