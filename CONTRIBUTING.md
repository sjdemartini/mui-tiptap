# Contributing Guidelines

_Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!_ :octocat:

## How can I contribute?

### GitHub issues

If you encounter a problem with this library or if you have a new feature you'd like to see in this project, please create [a new issue](https://github.com/sjdemartini/mui-tiptap/issues/new/choose).

### GitHub pull requests

Please leverage the repository's own tools to make sure the code is aligned with our standards. See the [Development setup](#development-setup) notes below. If you're using VSCode, it's easiest to use the recommended extensions (`.vscode/extensions.json`) to get integrated linting and autoformatting.

It's recommended to run all check commands before submitting the PR (`type:check`, `format:check`, `lint:check`, `spell:check`, `test:coverage`).

## Development setup

1. Set up [pnpm](https://pnpm.io/installation)
2. Run `pnpm install`
3. Run `pnpm dev` and view the demo site at the printed localhost URL

This package uses Vite with Hot Module Replacement (HMR), so file edits should reflect immediately in your browser during local development.

To instead test a "built" version of this package which is installed into an "external" module, you can run `pnpm example`, which runs a server with the separate application in the `example/` directory.

### Adding a new icon

When the `@mui/icons-material` icon set is insufficient, it can be helpful to browse a larger set of free open-source icons and add what’s needed directly to `mui-tiptap`. This also avoids any additional third-party JS dependencies.

1. Download an icon (e.g. from https://iconbuddy.app, which aggregates and organizes thousands of free icons from many separate icon libraries and sources)
2. Create a new tsx file in `src/icons/`
3. If icon edits or customizations are needed, https://yqnn.github.io/svg-path-editor/ and https://boxy-svg.com/app are handy free web-based tools. Typically you will want to work with and export in a "0 0 24 24" viewBox, since that is what MUI icons use by default.
4. Copy the `<path>` from the downloaded SVG, and in the new TSX file, pass that as the argument to the `createSvgIcon` helper from `@mui/material`. (If there are multiple `<path>`s, put them within a React Fragment.)
5. Export the icon component in that new file and in `src/icons/index.ts`.

## Releasing a new version (for maintainers)

When a new version should be cut since some new changes have landed on the `main` branch, do the following to publish it:

1. Go to the `main` branch and pull in the latest changes.
2. Run `npm version <major | minor | patch | premajor | preminor | prepatch | prerelease>`, depending on what's appropriate per semver conventions for the latest changes.
   - This will create a commit that updates the `version` in `package.json`, and add a git tag for that new commit.
3. Push the commit and tag (ex: `git push origin main` and `git push origin refs/tags/v0.0.0`, where `v0.0.0` is the new version number/tag).
4. The `release.yml` GitHub Actions workflow will run and should publish to npm upon completion.
5. Once the new version has been successfully published to npm, create a "Release" in GitHub for to the newly pushed tag, per the steps [here](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release), which can auto-generate release notes that can be edited and cleaned up for clarity and succinctness.
