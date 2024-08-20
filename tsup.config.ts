import { defineConfig } from "tsup";

export default defineConfig({
  clean: true, // Clean dist folder before building
  // Perhaps we should consider generating the types ourselves after the tsup
  // build instead of setting `dts: true`, so that we can create type files per
  // input file, rather than a single type file for the full bundle, a la
  // https://github.com/refinedev/refine/blob/4c34444633a252fd830fc3ddbc5963e112269e2f/packages/mui/tsup.config.ts#L34,
  // https://github.com/refinedev/refine/blob/4c34444633a252fd830fc3ddbc5963e112269e2f/packages/shared/generate-declarations.js
  dts: true,
  entry: ["src/index.ts", "src/icons/index.ts"],
  format: ["cjs", "esm"],
  sourcemap: true,
  esbuildPlugins: [
    {
      // Convert icons-material imports to the explicit ESM path in ESM context
      // to avoid issues here https://github.com/mui/material-ui/issues/35233.
      // Taken from
      // https://github.com/refinedev/refine/blob/4c34444633a252fd830fc3ddbc5963e112269e2f/packages/shared/mui-icons-material-esm-replace-plugin.ts
      name: "muiIconsMaterialEsmReplace",
      setup: (build) => {
        if (build.initialOptions.format === "esm") {
          build.onEnd((args) => {
            const muiIconsMaterialImportRegexp =
              /from\s?"@mui\/icons-material\/(\w*?)"/g;
            const muiIconsMaterialEsmImport =
              'from "@mui/icons-material/esm/$1"';

            const jsOutputFiles =
              args.outputFiles?.filter(
                (el) => el.path.endsWith(".mjs") || el.path.endsWith(".js")
              ) ?? [];

            for (const jsOutputFile of jsOutputFiles) {
              const str = new TextDecoder("utf-8").decode(
                jsOutputFile.contents
              );
              const newStr = str.replace(
                muiIconsMaterialImportRegexp,
                muiIconsMaterialEsmImport
              );
              jsOutputFile.contents = new TextEncoder().encode(newStr);
            }
          });
        }
      },
    },
  ],
});
