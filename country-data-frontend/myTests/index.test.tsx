import { expect, test } from 'vitest'
import { render, screen } from '@testing-library/react'
import Home from '../src/pages'
import '@testing-library/jest-dom';

test('renders loading state while fetching data', async () => {
  render(<Home />);
  expect(screen.getByText(/loading/i)).toBeInTheDocument(); // Ensure the loading text is rendered
});

