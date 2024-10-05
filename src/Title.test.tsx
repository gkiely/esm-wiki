import { expect, test } from 'bun:test';
import { render, screen } from '@testing-library/react';
import { Title } from './Title';

test('Title', () => {
  render(<Title title="Hello World" />);
  expect(screen.getByText('Hello World')).toBeInTheDocument();
});
