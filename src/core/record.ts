import type { CsvInput, CsvRecord } from '../types';
import { encodeField } from './encode';
import type { ResolvedCsvOptions } from './options';

/**
 * Determine the ordered column keys for a dataset. Explicit `columns` win;
 * otherwise the stable union of every record's keys (first-seen order) is used,
 * so reordered or partial records never shift columns.
 */
export function resolveColumns(
  input: CsvInput,
  options: ResolvedCsvOptions
): readonly string[] {
  if (options.columns) return options.columns;

  const keys = new Set<string>();
  for (const record of input) {
    for (const key of Object.keys(record)) keys.add(key);
  }
  return [...keys];
}

/** Encode one record into a CSV line by pulling values per resolved column. */
export function encodeRecord(
  record: CsvRecord,
  columns: readonly string[],
  options: ResolvedCsvOptions
): string {
  const cells: string[] = [];
  for (const key of columns) {
    // An absent key and an explicit `undefined` are treated identically.
    cells.push(encodeField(record[key], options));
  }
  return cells.join(options.separator);
}
