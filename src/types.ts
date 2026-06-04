/** A single scalar that can appear in a CSV cell. */
export type CsvPrimitive =
  | string
  | number
  | boolean
  | bigint
  | null
  | undefined;

/** A cell value: a scalar, or an array of scalars joined within one field. */
export type CsvCell = CsvPrimitive | readonly CsvPrimitive[];

/** One record (row) keyed by column name. */
export type CsvRecord = Record<string, CsvCell>;

/** The input passed to the encoder: an ordered list of records. */
export type CsvInput = readonly CsvRecord[];

/**
 * When to wrap a field in quotes.
 * - `minimal`: only when the value contains the separator, a quote, CR or LF (RFC 4180).
 * - `all`: always quote every field.
 */
export type QuotingMode = 'minimal' | 'all';

/** How boolean values are rendered. */
export interface BooleanStyle {
  readonly true: string;
  readonly false: string;
}

/** User-facing encoder options. Every field is optional and falls back to a default. */
export interface CsvOptions {
  /** Field separator. Default `,`. */
  separator?: string;
  /** Quote character used when a field must be quoted. Default `"`. */
  quote?: string;
  /** Line terminator between records. Default `\r\n` (RFC 4180). */
  newline?: string;
  /** Quoting strategy. Default `minimal`. */
  quoting?: QuotingMode;
  /** Whether to emit a header row. Default `true`. */
  showHeaders?: boolean;
  /**
   * Explicit column keys, in order. When omitted the columns are the stable
   * union of every record's keys, in first-seen order.
   */
  columns?: readonly string[];
  /**
   * Header labels to display. When omitted the column keys are used as labels.
   * Mapped positionally onto the resolved columns.
   */
  headers?: readonly string[];
  /** Text for `null` values. Default `""`. */
  nullText?: string;
  /** Text for `undefined` values. Default `""`. */
  undefinedText?: string;
  /** Text for `NaN` values. Default `""`. */
  nanText?: string;
  /** Text for `Infinity` (`-Infinity` is rendered as `-` + this). Default `Infinity`. */
  infinityText?: string;
  /** Rendering of boolean values. Default `{ true: "true", false: "false" }`. */
  booleans?: BooleanStyle;
  /** Separator used to join an array within a single cell. Default `", "`. */
  arraySeparator?: string;
  /** Prepend a UTF-8 byte-order mark. Default `false`. */
  bom?: boolean;
}
