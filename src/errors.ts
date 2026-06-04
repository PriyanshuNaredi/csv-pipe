/** Base class for every error thrown by csv-pipe. */
export class CsvPipeError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'CsvPipeError';
  }
}
