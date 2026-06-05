// The common case: turn an array of objects into a CSV string. The header is
// inferred from the record keys, and a field is quoted only when it must be.
import { stringify } from 'csv-pipe';

type User = { name: string; email: string; age: number };

const users: User[] = [
  { name: 'Alex Johnson', email: 'alex.johnson@example.com', age: 29 },
  { name: 'Carlos Herrera', email: 'carlos.h24@example.com', age: 24 }
];

console.log(stringify(users));
// name,email,age
// Alex Johnson,alex.johnson@example.com,29
// Carlos Herrera,carlos.h24@example.com,24
