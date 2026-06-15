// Compile-time checks for the public type surface. This file is type-checked by
// `tsc` but never executed; it asserts that bad column keys are rejected.
import { createCsvEncoder, stringify } from './index';

interface User {
  name: string;
  age: number;
}

const users: User[] = [{ name: 'Alex', age: 29 }];

// Valid: known keys, both array and map forms.
stringify(users, { columns: ['name', 'age'] });
stringify(users, { columns: { name: 'Full name' } });

// @ts-expect-error unknown column key in array form
stringify(users, { columns: ['nope'] });

// @ts-expect-error unknown column key in map form
stringify(users, { columns: { nope: 'X' } });

const encoder = createCsvEncoder<User>({ columns: ['name'] });
encoder(users);
encoder.row(users[0]!);

export {};
