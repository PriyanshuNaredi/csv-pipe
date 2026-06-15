// Guard untrusted data against spreadsheet formula injection. Any string or
// array cell that begins with a formula character is prefixed so the value is
// shown literally. Numbers, booleans, and dates are never altered.
import { stringify } from 'csv-pipe';

const rows = [
  { name: '=1+1', note: 'leading equals' },
  { name: '@SUM(A1:A9)', note: 'leading at' },
  { name: 'Alex Johnson', note: 'safe value' }
];

console.log(stringify(rows, { sanitizeFormulas: true }));
// name,note
// '=1+1,leading equals
// '@SUM(A1:A9),leading at
// Alex Johnson,safe value

// The prefix defaults to a single quote and can be changed.
console.log(stringify(rows, { sanitizeFormulas: true, formulaPrefix: '\t' }));
