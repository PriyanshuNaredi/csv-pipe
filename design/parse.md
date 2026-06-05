# Design: `parse` (CSV to records)

Status: draft for review. This is the spec to lock before implementation.
Goal: add the missing half so csv-pipe wins both directions and beats papaparse,
fast-csv, and csv-parse on every parameter. See the mandate in memory.

## 1. Goals and non-goals

Goals:

- A typed, streaming, RFC 4180 parser that mirrors `stringify` / `createCsvEncoder`.
- Fastest of the common parsers, proven in CI.
- Zero dependencies, tree-shakeable separately from the encoder, all runtimes.
- Round-trip stable with the encoder: `parse(stringify(x))` recovers `x`.
- Located errors (line and column), like the encoder.

Non-goals (v1 of parse):

- A schema/validation engine. We integrate with one via a hook, we do not build one.
- Spreadsheet formula evaluation. Values stay text unless dynamic typing is on.
- Worker-thread offloading (papaparse-style). Revisit later if needed.

## 2. Public API (symmetry with encode)

| Encode                                        | Parse                                             |
| --------------------------------------------- | ------------------------------------------------- |
| `stringify(data, options): string`            | `parse(text, options): T[]`                       |
| `createCsvEncoder<T>(options)`                | `createCsvParser<T>(options)`                     |
| `encoder.stream(data): AsyncIterable<string>` | `parser.stream(source): AsyncIterable<T>`         |
| `encoder.row(record): string`                 | `parser.row(line): T`                             |
| `toReadableStream(asyncIterable)`             | parser accepts a `ReadableStream` directly        |
| `writeCsv` (node)                             | `readCsv` (node): file path to `AsyncIterable<T>` |

```ts
import { parse, createCsvParser } from 'csv-pipe';

type User = { name: string; email: string; age: number };

// Sync: string -> typed records
const users = parse<User>(csvText);
//    ^ User[]

// Reusable, with streaming
const parser = createCsvParser<User>({ dynamicTyping: true });
for await (const user of parser.stream(request.body)) {
  // user: User, one at a time, flat memory
}
```

## 3. Type design (be honest about runtime)

TypeScript cannot guarantee that parsed data matches `T` at runtime. We make the
contract explicit and offer two levels:

1. **Asserted types (default).** `parse<T>(text)` returns `T[]` as a typed
   assertion, like `JSON.parse(text) as T`. Fast and ergonomic. The library does
   not verify the shape; documented clearly.
2. **Validated types (opt-in).** A `row` hook receives the raw parsed record and
   returns the final element. This is where a validator (zod, valibot, a hand
   written guard) plugs in, with no dependency from us.

```ts
parse(text, {
  row: (raw) => UserSchema.parse(raw) // returns User, throws on bad data
});
```

Header to key typing: with `header: true`, keys come from the header row. With a
`columns` map we can rename header labels to typed keys, mirroring encode.

OPEN QUESTION A: is `header: true` the default? Proposed yes (papaparse parity,
and it is what `parse<T>` implies).

## 4. Options (mirror encode, add parse-only)

Shared with encode (same names, same meaning):

- `separator`, `quote`, `newline` (output side only; parse detects CR/LF/CRLF),
  `comment` (new), `trim` (new).

Parse-specific:

| Option           | Type                             | Default     | Meaning                                                 |
| ---------------- | -------------------------------- | ----------- | ------------------------------------------------------- |
| `header`         | `boolean`                        | `true`      | First row supplies keys. If false, rows are `string[]`. |
| `columns`        | `(keyof T)[]` or map             | from header | Select, order, and rename columns into typed keys.      |
| `dynamicTyping`  | `boolean \| (column) => boolean` | `false`     | Coerce `"1"`→`1`, `"true"`→`true`, empty→`null`.        |
| `skipEmptyLines` | `boolean \| 'greedy'`            | `true`      | Drop blank lines (greedy also drops whitespace-only).   |
| `comment`        | `string`                         | none        | Lines starting with this are skipped.                   |
| `trim`           | `boolean`                        | `false`     | Trim whitespace around unquoted fields.                 |
| `bom`            | `boolean`                        | auto        | Strip a leading UTF-8 BOM. Auto-detect by default.      |
| `separator`      | `string \| 'auto'`               | `,`         | `'auto'` sniffs `, ; \t \|` from the first line.        |
| `row`            | `(raw) => T`                     | none        | Validate or transform each record (typed exit).         |
| `maxRows`        | `number`                         | none        | Stop after N records (useful for previews).             |

OPEN QUESTION B: should `dynamicTyping` default off (safe, strings stay strings)
or on (papaparse-like convenience)? Proposed off for determinism and to avoid
surprising coercions; users opt in.

## 5. Streaming model

`parser.stream(source)` accepts:

- `string`
- `AsyncIterable<string>` / `Iterable<string>` (chunks)
- `ReadableStream<string | Uint8Array>` (Web)
- a Node `Readable` is supported via its async iterator

It returns `AsyncIterable<T>`, emitting records as soon as a full row is
available, holding only partial-row state between chunks (flat memory). Bytes are
decoded with `TextDecoder` (streaming mode) so multi-byte characters split across
chunks are handled.

Internally: a single character state machine over each chunk with states
`{ FIELD_START, IN_FIELD, IN_QUOTED, QUOTE_IN_QUOTED }`, carrying the in-progress
field and row across chunk boundaries. No regex on the hot path, matching the
encoder's approach.

## 6. Round-trip and correctness

- Property test (fast-check, already in the repo): for random records,
  `parse(stringify(x))` equals `x` (modulo documented coercions). And for random
  valid CSV, `stringify(parse(s))` is stable.
- RFC 4180 corners to cover: quoted fields containing the separator, quotes, CR,
  LF, and CRLF; doubled quotes inside quoted fields; trailing newline or not;
  leading BOM; ragged rows.

OPEN QUESTION C: ragged rows (a row with fewer or more fields than the header).
Options: (1) throw a located error in `strict` mode, (2) pad missing with
`undefined` / drop extras by default. Proposed: lenient default (pad/ignore) with
a `strict: true` to make it throw.

## 7. Errors

Reuse `CsvPipeError`. A malformed quote (for example a quote inside an unquoted
field, or an unterminated quoted field at EOF) throws with the line and column.
Lenient by default for ragged rows; `strict` upgrades structural issues to throws.

## 8. Packaging and size

- Export `parse` and `createCsvParser` from the main entry (`csv-pipe`).
- Implement parse in its own module graph (`src/decode/*`, `src/core/parser.ts`)
  so a bundler tree-shakes it away when only `stringify` is imported, and vice
  versa. Add separate size-limit budgets: `parse` alone, `stringify` alone, both.
- Node helper `readCsv(path, options): AsyncIterable<T>` in `csv-pipe/node`,
  mirroring `writeCsv`.

## 9. Benchmarks (prove the win)

Add a parse suite mirroring the encode bench: vs papaparse, fast-csv,
`csv-parse`, across small / wide / large / quote-heavy datasets. Wire into the
existing bench tracking and CI regression alert. Target: fastest on every row.

## 10. Decisions to confirm before coding

- A: `header: true` as default. (proposed: yes)
- B: `dynamicTyping` default off. (proposed: yes, off)
- C: ragged rows lenient by default, `strict` to throw. (proposed: yes)
- D: scope of `separator: 'auto'` detection set: `, ; \t |`. (proposed: yes)
- E: ship parse in the same `2.x` line as a minor, or hold for a `2.<next>` feature release. (proposed: a dedicated minor once round-trip + benches are green)
