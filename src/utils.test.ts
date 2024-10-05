import { expect, test } from 'bun:test';
import { toCamelCase } from './utils';

test('toCamelCase', () => {
  expect(toCamelCase('hello-world')).toBe('helloWorld');
});
