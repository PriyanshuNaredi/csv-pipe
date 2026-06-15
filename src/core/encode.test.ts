import { describe, expect, it } from 'vitest';
import { encodeField } from './encode';
import { resolveOptions } from './options';

const options = resolveOptions();

describe('encodeField', () => {
  it('leaves clean values unquoted', () => {
    expect(encodeField('hello', options)).toBe('hello');
    expect(encodeField(42, options)).toBe('42');
    expect(encodeField('', options)).toBe('');
  });

  it('escapes embedded quotes by doubling them (RFC 4180)', () => {
    expect(encodeField('He said "hi"', options)).toBe('"He said ""hi"""');
  });

  it('quotes values containing the separator, CR or LF', () => {
    expect(encodeField('Lviv, UA', options)).toBe('"Lviv, UA"');
    expect(encodeField('a\nb', options)).toBe('"a\nb"');
    expect(encodeField('a\r\nb', options)).toBe('"a\r\nb"');
  });

  it('renders non-finite numbers consistently', () => {
    expect(encodeField(Infinity, options)).toBe('Infinity');
    expect(encodeField(-Infinity, options)).toBe('-Infinity');
    expect(encodeField(NaN, options)).toBe('');
  });

  it('renders null, undefined and booleans per options', () => {
    expect(encodeField(null, options)).toBe('');
    expect(encodeField(undefined, options)).toBe('');
    expect(encodeField(true, options)).toBe('true');
    expect(encodeField(false, options)).toBe('false');
  });

  it('joins arrays with the array separator (and quotes when needed)', () => {
    expect(encodeField([1, 2, 3], options)).toBe('"1, 2, 3"');
  });

  it('honors the "all" quoting mode', () => {
    const allQuoted = resolveOptions({ quoting: 'all' });
    expect(encodeField('hello', allQuoted)).toBe('"hello"');
    expect(encodeField(42, allQuoted)).toBe('"42"');
  });
});
