# csv-pipe

A small, fast, zero-dependency CSV encoder for TypeScript and JavaScript. It converts arrays of objects into RFC 4180-compliant CSV and runs in Node, browsers, Deno, Bun, and edge runtimes.

> Status: 2.0.0 alpha. The public API is `stringify`. A prepared encoder, streaming output, and platform helpers are on the roadmap.

## Why csv-pipe

- Correct by default. Quotes and escaping follow RFC 4180, so values containing commas, quotes, or newlines round-trip through any standard parser.
- Deterministic. The same input and options always produce the same output. There is no hidden state.
- Typed. First-class TypeScript types, no `any` in the public surface.
- Zero dependencies. Nothing is pulled into your bundle.

## Installation

```
npm install csv-pipe
```

## Usage

```typescript
import { stringify } from 'csv-pipe';

const users = [
  { name: 'Alex Johnson', email: 'alex.johnson@example.com', age: 29 },
  { name: 'Carlos Herrera', email: 'carlos.h24@example.com', age: 24 }
];

const csv = stringify(users);
// name,email,age
// Alex Johnson,alex.johnson@example.com,29
// Carlos Herrera,carlos.h24@example.com,24
```

By default the header row is derived from the record keys, and each field is quoted only when it contains the separator, a quote, a carriage return, or a line feed.

### Choosing and labelling columns

```typescript
const csv = stringify(users, {
  columns: ['name', 'email'],
  headers: ['Full name', 'Email address']
});
// Full name,Email address
// Alex Johnson,alex.johnson@example.com
// Carlos Herrera,carlos.h24@example.com
```

`columns` selects which keys to include and in what order. `headers` provides the labels for the header row, aligned to `columns` by position. When `columns` is omitted, the columns are the stable union of every record's keys in first-seen order, so records with reordered or missing keys never shift columns.

### Writing a file in Node

```typescript
import { writeFile } from 'node:fs/promises';
import { stringify } from 'csv-pipe';

await writeFile('users.csv', stringify(users), 'utf8');
```

## Options

All options are optional.

| Option           | Type                              | Default                            | Description                                                                |
| ---------------- | --------------------------------- | ---------------------------------- | -------------------------------------------------------------------------- |
| `separator`      | `string`                          | `,`                                | Field separator.                                                           |
| `quote`          | `string`                          | `"`                                | Quote character used when a field must be quoted.                          |
| `newline`        | `string`                          | `\r\n`                             | Line terminator between records.                                           |
| `quoting`        | `'minimal' \| 'all'`              | `minimal`                          | `minimal` quotes only when required by RFC 4180; `all` quotes every field. |
| `showHeaders`    | `boolean`                         | `true`                             | Whether to emit a header row.                                              |
| `columns`        | `string[]`                        | union of record keys               | Keys to include, in order.                                                 |
| `headers`        | `string[]`                        | the column keys                    | Header labels, aligned to `columns` by position.                           |
| `nullText`       | `string`                          | `""`                               | Rendering of `null`.                                                       |
| `undefinedText`  | `string`                          | `""`                               | Rendering of `undefined`.                                                  |
| `nanText`        | `string`                          | `""`                               | Rendering of `NaN`.                                                        |
| `infinityText`   | `string`                          | `Infinity`                         | Rendering of `Infinity`; `-Infinity` renders as `-` followed by this.      |
| `booleans`       | `{ true: string; false: string }` | `{ true: 'true', false: 'false' }` | Rendering of boolean values.                                               |
| `arraySeparator` | `string`                          | `, `                               | Separator used to join an array within a single cell.                      |
| `bom`            | `boolean`                         | `false`                            | Prepend a UTF-8 byte-order mark, which helps some spreadsheet apps.        |

## Behavior notes

- Quoted fields escape an embedded quote character by doubling it, per RFC 4180.
- `null`, `undefined`, and `NaN` render as an empty string by default.
- An absent key and an explicit `undefined` are treated identically.
- An array value is joined into a single cell using `arraySeparator`.

## TypeScript

```typescript
import type { CsvOptions, CsvRecord } from 'csv-pipe';
```

Exported types: `CsvOptions`, `CsvRecord`, `CsvInput`, `CsvCell`, `CsvPrimitive`, `QuotingMode`, `BooleanStyle`, and the `CsvPipeError` class.

## License

MIT (c) Martsin Labs. See [LICENSE](LICENSE).
