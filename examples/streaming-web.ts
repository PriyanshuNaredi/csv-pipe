// Serve a CSV as an HTTP response body without buffering it in memory. Works in
// any Web Streams runtime: browsers, Deno, Bun, edge, and Node 18+.
import { createCsvEncoder, toReadableStream } from 'csv-pipe';

type Row = { id: number; value: number };

function* rows(count: number): Generator<Row> {
  for (let id = 1; id <= count; id += 1) {
    yield { id, value: id * id };
  }
}

// Declared columns keep the stream fully incremental: one record in, one out.
const encoder = createCsvEncoder<Row>({ columns: ['id', 'value'] });

export function handler(): Response {
  return new Response(toReadableStream(encoder.stream(rows(100_000))), {
    headers: {
      'content-type': 'text/csv; charset=utf-8',
      'content-disposition': 'attachment; filename="squares.csv"'
    }
  });
}
