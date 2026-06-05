---
description: Install csv-pipe and convert between arrays of objects and RFC 4180 CSV in one line.
---

# Getting started

csv-pipe converts between arrays of objects and RFC 4180-compliant CSV, in both
directions. It has no dependencies and runs in Node, browsers, Deno, Bun, and
edge runtimes.

## Install

::: code-group

```sh [npm]
npm install csv-pipe
```

```sh [pnpm]
pnpm add csv-pipe
```

```sh [yarn]
yarn add csv-pipe
```

```sh [bun]
bun add csv-pipe
```

:::

## Quick start

```ts twoslash
import { stringify } from 'csv-pipe';

type User = { name: string; email: string; age: number };

const users: User[] = [
  { name: 'Alex Johnson', email: 'alex@example.com', age: 29 },
  { name: 'Carlos Herrera', email: 'carlos@example.com', age: 24 }
];

stringify(users);
// name,email,age
// Alex Johnson,alex@example.com,29
// Carlos Herrera,carlos@example.com,24
```

The header comes from the record keys, and a field is quoted only when it
contains the separator, a quote, or a line break. That is the whole API for the
common case.

## Parse it back

`parse` is the mirror of `stringify`, turning CSV into typed records.

```ts
import { parse } from 'csv-pipe';

type User = { name: string; email: string; age: number };

parse<User>('name,email,age\nAlex Johnson,alex@example.com,29');
// [{ name: 'Alex Johnson', email: 'alex@example.com', age: '29' }]
```

See the [parsing guide](./parsing) for streaming, columns, and validation.

## Reusing an encoder

`createCsvEncoder` resolves options once and returns a callable encoder with
`row` and `stream`. Use it to encode many datasets with the same configuration.
`stringify(data, options)` is shorthand for `createCsvEncoder(options)(data)`.

```ts
import { createCsvEncoder } from 'csv-pipe';

const toCsv = createCsvEncoder<User>({ columns: ['name', 'email'] });

toCsv(users); // the whole document as a string
toCsv.row(users[0]); // one line, without a header
```

## Next steps

- [Why csv-pipe](./why) for the problems it removes.
- [Choosing columns](./columns) to select, order, and rename.
- [Parsing](./parsing) to read CSV into typed records.
- [Streaming](./streaming) for large datasets and HTTP responses.
- [API reference](/api/) for every export.
