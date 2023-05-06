# Contributing Guidelines

_Pull requests, bug reports, and all other forms of contribution are welcomed and highly encouraged!_ :octocat:

This guide serves to set clear expectations for everyone involved with the project so that we can improve it together while also creating a welcoming space for everyone to participate. Following these guidelines will help ensure a positive experience for contributors and maintainers.

## :inbox_tray: How can I Contribute?

### GitHub issues

If you encounter a problem with this library or if you have a new feature you'd like to see in this project, please create [a new issue](https://github.com/sjdemartini/mui-tiptap/issues/new/choose).

### GitHub Pull requests

Please leverage the repository's own tools to make sure the code is aligned with our standards:

1. Run all check commands before submitting the PR (`type:check`, `format:check`, `lint:check`, `test:coverage` and `spell:check`)
2. Please commit your changes and run a `setup` command so you can actually check how would the template look like once cleaned up
3. Always leverage the `cz` command to create a commit. We heavily rely on this for automatic releases.

## Development demo setup

1. Set up [pnpm](https://pnpm.io/installation)
2. Run `pnpm install`
3. Run `pnpm dev` and view the demo site at the printed localhost URL
