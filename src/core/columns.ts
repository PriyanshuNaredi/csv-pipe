import type { CsvColumns, CsvRecord } from '../types';

/** A column resolved to the key it reads and the header label it shows. */
export interface ResolvedColumn {
  readonly key: string;
  readonly header: string;
}

/**
 * Resolve the ordered columns for a dataset.
 *
 * - An array option becomes columns whose header equals the key.
 * - A map option becomes columns in insertion order, key to label.
 * - When no option is given, the columns are the stable union of every record's
 *   keys in first-seen order, so reordered or partial records never shift.
 */
export function resolveColumns<T extends CsvRecord>(
  records: readonly CsvRecord[],
  columns: CsvColumns<T> | undefined
): readonly ResolvedColumn[] {
  if (Array.isArray(columns)) {
    return (columns as readonly string[]).map((key) => ({ key, header: key }));
  }

  if (columns) {
    return Object.entries(columns).map(([key, header]) => ({
      key,
      header: (header as string | undefined) ?? key
    }));
  }

  const keys = new Set<string>();
  for (const record of records) {
    for (const key of Object.keys(record)) keys.add(key);
  }

  return [...keys].map((key) => ({ key, header: key }));
}
