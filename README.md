# ValueFlows marketplace app

> The 'kitchen sink' of REA-based marketplaces: gifting, requests, offers & needs, exchanges, sales, multilateral trades & multi-value exchanges.

<!-- MarkdownTOC -->

- [Development setup](#development-setup)
	- [Initialising](#initialising)
- [Running for development](#running-for-development)
- [Building and running in production mode](#building-and-running-in-production-mode)
- [Framework](#framework)
- [License](#license)

<!-- /MarkdownTOC -->

## Development setup

### Initialising
 
- clone this repo
- `nix develop` to enter the Nix environment & load all dependencies
- `pnpm i` to install dependencies and setup the repository

## Running for development

Simply `pnpm start` to boot up some local Holochain agents for testing.

## Building and running in production mode

To create an optimised version of the app:

```bash
pnpm run package
```


## Framework

- UI components authored with [Svelte](https://svelte.dev/)
	- Forms with [Svelte Forms](https://chainlist.github.io/svelte-forms/)
	- App-level routing with [Routve](https://www.npmjs.com/package/routve)
	- Compiled to other runtimes via [Svelte UCC](https://github.com/pospi/svelte-universal-component-compiler)
- API connections through [Apollo GraphQL](https://www.apollographql.com/)
	- Pluggable backends via `@vf-ui/graphql-client-*` modules


## License

Apache 2.0
