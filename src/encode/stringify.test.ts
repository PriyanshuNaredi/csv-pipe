import Papa from 'papaparse';
import { describe, expect, it } from 'vitest';
import { stringify } from './stringify';

describe('stringify', () => {
  it('emits a header row derived from the column keys by default', () => {
    expect(stringify([{ name: 'Alex', age: 29 }])).toBe('name,age\r\nAlex,29');
  });

  it('emits nothing (no empty header row) for an empty dataset', () => {
    expect(stringify([])).toBe('');
  });

  it('keeps columns aligned across reordered, missing and extra keys', () => {
    const csv = stringify([{ a: 1, b: 2 }, { b: 3, a: 4 }, { a: 5 }]);
    expect(csv).toBe('a,b\r\n1,2\r\n4,3\r\n5,');
  });

  it('uses explicit header labels when provided', () => {
    const csv = stringify([{ name: 'Alex' }], {
      columns: ['name'],
      headers: ['Full Name']
    });
    expect(csv).toBe('Full Name\r\nAlex');
  });

  it('omits the header row when showHeaders is false', () => {
    expect(stringify([{ a: 1 }], { showHeaders: false })).toBe('1');
  });

  it('prepends a BOM when requested', () => {
    expect(stringify([{ a: 1 }], { bom: true })).toBe('﻿a\r\n1');
  });

  it('round-trips through a standard CSV parser', () => {
    const data = [{ name: 'Alex, Jr.', quote: 'say "hi"', n: 29 }];
    const parsed = Papa.parse<Record<string, string>>(stringify(data), {
      header: true
    }).data;
    expect(parsed).toEqual([{ name: 'Alex, Jr.', quote: 'say "hi"', n: '29' }]);
  });
});
