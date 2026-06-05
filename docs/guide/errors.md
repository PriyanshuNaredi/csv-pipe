---
description: Handle CsvPipeError and prevent unencodable cell values with the format hook.
---

# Error handling

csv-pipe throws a single error type, `CsvPipeError`, which extends `Error`. It
is also exported, so you can catch it precisely.

## When it throws

A CSV cell must be a string, number, boolean, bigint, `null`, `undefined`, or an
array of those. A value that cannot be a cell (a plain object, a function, or a
symbol) throws, and the message names the row and column where it happened.

```ts
import { stringify } from 'csv-pipe';

stringify([{ a: 1 }, { a: { nested: true } }]);
// CsvPipeError: Cannot encode an object at row 1, column "a".
// A CSV cell must be a string, number, boolean, bigint, null, undefined,
// or an array of those.
```

## Handling it

Catch `CsvPipeError` to distinguish it from other failures.

```ts
import { stringify, CsvPipeError } from 'csv-pipe';

try {
  return stringify(rows);
} catch (error) {
  if (error instanceof CsvPipeError) {
    // a cell value was not encodable; the message names the row and column
  }
  throw error;
}
```

## Preventing it

Use the [`format`](./formatting) hook to turn rich values into something
encodable before they reach a cell, for example serializing nested objects:

```ts
stringify(rows, {
  format: (value) =>
    value !== null && typeof value === 'object' && !Array.isArray(value)
      ? JSON.stringify(value)
      : value
});
```
