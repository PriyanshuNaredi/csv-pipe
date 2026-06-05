# Contributing

Thanks for considering a contribution. This guide covers the setup and the
conventions the project follows.

By taking part, you agree to uphold our [Code of Conduct](CODE_OF_CONDUCT.md).
To report a vulnerability, follow the [Security Policy](SECURITY.md) instead of
opening a public issue.

## Setup

Requires Node 18 or newer.

```
npm install
```

## Scripts

| Script                  | What it does                                        |
| ----------------------- | --------------------------------------------------- |
| `npm test`              | Run the test suite once                             |
| `npm run test:watch`    | Run the tests in watch mode                         |
| `npm run coverage`      | Run the tests with coverage                         |
| `npm run typecheck`     | Type-check with no emit                             |
| `npm run lint`          | Lint with ESLint                                     |
| `npm run format`        | Format with Prettier                                |
| `npm run build`         | Build the bundles and declarations                  |
| `npm run size`          | Build and check the bundle-size budget              |
| `npm run bench`         | Run the encoding benchmarks                          |
| `npm run check:package` | Build, then verify the package with publint and attw |

## Conventions

- TypeScript in strict mode. No `any` in the public surface.
- Names are concise but whole words; no single-letter identifiers.
- Prettier owns formatting; run `npm run format` before committing.
- Commit messages follow Conventional Commits.

## Changesets

The changelog is driven by [changesets](https://github.com/changesets/changesets).
When a change affects the published package, add one:

```
npm run changeset
```

## Pull request checklist

- Tests pass and cover the change.
- `npm run typecheck`, `npm run lint`, and `npm run format:check` are clean.
- A changeset is included when public behavior changes.
- The README and CHANGELOG are updated when relevant.
