---
'csv-pipe': major
---

v2.0.0 — complete rewrite into a fast, deterministic, RFC 4180-correct CSV encoder.

**Breaking changes**

- New API surface: `stringify(data, options)` is the primary entry (JSON-parity);
  the old `CsvPipe.generate` flow is replaced.
- Fully typed options (`CsvOptions`) with no `any`; removed the old `CpConfig` shape.
- Behavior defaults changed:
  - `null` / `undefined` / `NaN` now render as `""` (was `"null"` / `"undefined"`).
  - Booleans now render as `true` / `false` (was `TRUE` / `FALSE`).
  - Quoting is now `minimal` by default — fields are quoted only when they
    contain the separator, a quote, CR or LF (was: every field quoted).
  - Columns are the stable union of record keys; an absent key and an explicit
    `undefined` are treated identically.

**Fixes**

- RFC 4180 quote escaping (embedded quotes are doubled).
- Stable column alignment across reordered / partial records.
- No more empty header row with the default configuration.
- Deterministic core: no import-time state (filename timestamp bug removed).
- Consistent handling of `-Infinity` and `NaN`.

**Tooling**

- Dual ESM + CJS build with type declarations (tsup), TypeScript 6, Vitest with
  coverage, ESLint, Prettier. Zero runtime dependencies.
