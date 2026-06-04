import type { ResolvedCsvOptions } from './options';

/**
 * Built-in defaults. Chosen to be RFC 4180-correct and CSV-idiomatic:
 * empty strings for absent/non-finite values, comma + CRLF framing, and
 * minimal quoting so clean values stay unquoted.
 */
export const DEFAULT_OPTIONS: ResolvedCsvOptions = {
  separator: ',',
  quote: '"',
  newline: '\r\n',
  quoting: 'minimal',
  showHeaders: true,
  columns: undefined,
  headers: undefined,
  nullText: '',
  undefinedText: '',
  nanText: '',
  infinityText: 'Infinity',
  booleans: { true: 'true', false: 'false' },
  arraySeparator: ', ',
  bom: false
};
