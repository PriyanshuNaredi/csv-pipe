import type { BooleanStyle, CsvOptions, QuotingMode } from '../types';
import { DEFAULT_OPTIONS } from './constants';

/**
 * Fully-resolved options: the same shape as {@link CsvOptions} but with every
 * field present. This is the only options type the core encoder ever sees,
 * which keeps the encoding path branch-free of "is this set?" checks.
 */
export interface ResolvedCsvOptions {
  readonly separator: string;
  readonly quote: string;
  readonly newline: string;
  readonly quoting: QuotingMode;
  readonly showHeaders: boolean;
  readonly columns: readonly string[] | undefined;
  readonly headers: readonly string[] | undefined;
  readonly nullText: string;
  readonly undefinedText: string;
  readonly nanText: string;
  readonly infinityText: string;
  readonly booleans: BooleanStyle;
  readonly arraySeparator: string;
  readonly bom: boolean;
}

/** Merge user options over the defaults into a fully-resolved option set. */
export function resolveOptions(options: CsvOptions = {}): ResolvedCsvOptions {
  return {
    separator: options.separator ?? DEFAULT_OPTIONS.separator,
    quote: options.quote ?? DEFAULT_OPTIONS.quote,
    newline: options.newline ?? DEFAULT_OPTIONS.newline,
    quoting: options.quoting ?? DEFAULT_OPTIONS.quoting,
    showHeaders: options.showHeaders ?? DEFAULT_OPTIONS.showHeaders,
    columns: options.columns ?? DEFAULT_OPTIONS.columns,
    headers: options.headers ?? DEFAULT_OPTIONS.headers,
    nullText: options.nullText ?? DEFAULT_OPTIONS.nullText,
    undefinedText: options.undefinedText ?? DEFAULT_OPTIONS.undefinedText,
    nanText: options.nanText ?? DEFAULT_OPTIONS.nanText,
    infinityText: options.infinityText ?? DEFAULT_OPTIONS.infinityText,
    arraySeparator: options.arraySeparator ?? DEFAULT_OPTIONS.arraySeparator,
    booleans: { ...DEFAULT_OPTIONS.booleans, ...options.booleans },
    bom: options.bom ?? DEFAULT_OPTIONS.bom
  };
}
