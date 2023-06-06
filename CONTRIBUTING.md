# Contributing Guidelines

_Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!_ :octocat:

## :inbox_tray: How can I Contribute?

### GitHub issues

If you encounter a problem with this library or if you have a new feature you'd like to see in this project, please create [a new issue](https://github.com/sjdemartini/mui-tiptap/issues/new/choose).

### GitHub Pull requests

Please leverage the repository's own tools to make sure the code is aligned with our standards:

1. Run all check commands before submitting the PR (`type:check`, `format:check`, `lint:check`, `test:coverage` and `spell:check`)
2. Please commit your changes and run a `setup` command so you can actually check how would the template look like once cleaned up
3. Always leverage the `cz` command to create a commit. We heavily rely on this for automatic releases.

## Development setup

1. Set up [pnpm](https://pnpm.io/installation)
2. Run `pnpm install`
3. Run `pnpm dev` and view the demo site at the printed localhost URL

This package uses Vite with Hot Module Replacement (HMR), so file edits should reflect immediately in your browser during local development.

To instead test a "built" version of this package which is installed into an "external" module, you can run `pnpm example`, which runs a server with the separate application in the `example/` directory.

## Releasing a new version (for maintainers)

When a new version should be cut since some new changes have landed on the `main` branch, do the following to publish it:

1. Go to the `main` branch and pull in the latest changes.
2. Run `npm version <major | minor | patch | premajor | preminor | prepatch | prerelease>`, depending on what's appropriate per semver conventions for the latest changes .
   - This will create a commit that updates the `version` in `package.json`, and add a git tag for that new commit.
3. Push the commit and tags (ex: `git push --tags`)
4. The `release.yml` GitHub Actions workflow will run and should publish to npm upon completion.
5. Once the new version has been successfully published to npm, create a "Release" in GitHub for to the newly pushed tag, per the steps [here](https://docs.github.com/en/repositories/releasing-projects-on-github/managing-releases-in-a-repository#creating-a-release), which can auto-generate release notes that can be edited and cleaned up for clarity and succinctness.
