import { describe, expect, it } from 'vitest';
import { CsvPipeError } from './errors';

describe('CsvPipeError', () => {
  it('is an Error with a stable name and the given message', () => {
    const error = new CsvPipeError('bad value in column "age"');

    expect(error).toBeInstanceOf(Error);
    expect(error).toBeInstanceOf(CsvPipeError);
    expect(error.name).toBe('CsvPipeError');
    expect(error.message).toBe('bad value in column "age"');
  });
});
