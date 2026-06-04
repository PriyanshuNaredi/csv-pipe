import { encodeField } from '../core/encode';
import { resolveOptions } from '../core/options';
import { encodeRecord, resolveColumns } from '../core/record';
import type { CsvInput, CsvOptions } from '../types';

/**
 * Encode a dataset into a single CSV string.
 *
 * Pure and deterministic: the same input and options always produce the same
 * output. Columns are resolved once and applied to every record, so partial or
 * reordered records stay aligned. No header row is emitted when there are no
 * columns to describe.
 */
export function stringify(input: CsvInput, options: CsvOptions = {}): string {
  const resolved = resolveOptions(options);
  const columns = resolveColumns(input, resolved);
  const lines: string[] = [];

  if (resolved.showHeaders && columns.length > 0) {
    const labels = resolved.headers ?? columns;
    lines.push(
      labels
        .map((label) => encodeField(label, resolved))
        .join(resolved.separator)
    );
  }

  for (const record of input) {
    lines.push(encodeRecord(record, columns, resolved));
  }

  const body = lines.join(resolved.newline);
  return resolved.bom ? `﻿${body}` : body;
}
