// Transform values before they are encoded. A Date renders as an ISO string out
// of the box; the format hook handles everything else (number formats, nested
// objects). Return a value unchanged to pass it through.
import { stringify } from 'csv-pipe';

type Order = { id: number; total: number; placedAt: Date };

const orders: Order[] = [
  { id: 1, total: 19.5, placedAt: new Date('2026-06-04T10:00:00Z') },
  { id: 2, total: 4, placedAt: new Date('2026-06-05T12:30:00Z') }
];

console.log(
  stringify(orders, {
    format: (value) => (typeof value === 'number' ? value.toFixed(2) : value)
  })
);
// id,total,placedAt
// 1.00,19.50,2026-06-04T10:00:00.000Z
// 2.00,4.00,2026-06-05T12:30:00.000Z
