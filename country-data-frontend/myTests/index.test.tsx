import { expect, test, describe, vi } from 'vitest'; // Import vi for mocks

import { render, screen, waitFor, fireEvent, act } from '@testing-library/react';

import Home from '../src/pages';

import '@testing-library/jest-dom';

import axios from 'axios';



// Use vi.mock instead of jest.mock

vi.mock('axios');



// alis for axios..get

const mockAxiosGet = axios.get as jest.Mock;



describe('Home component', () => {

  test('renders loading state while fetching data', async () => {

    // Mock the axios call to resolve after a delay

    mockAxiosGet.mockResolvedValue({ data: [] });

  

    render(<Home />);

  

    // Ensure the spinnner is visible during loading

    expect(screen.getByRole('status')).toBeInTheDocument();  // Assuming the spinner has role="status"

    

    // Wait for the loading state to disappear (you could also check for absence of spinner)

    await waitFor(() => expect(screen.queryByRole('status')).toBeNull());

  });



  test('renders error message when data fetch fails', async () => {

    // Mock the axios call to reject

    mockAxiosGet.mockRejectedValue(new Error('Failed to load countries'));

    

    render(<Home />);

    

    // Wait for the error message to appear

    await waitFor(() => expect(screen.getByText(/failed to load countries/i)).toBeInTheDocument());

  });



  test('renders countries after successful fetch', async () => {

    // Mock the axios call with sample countries data

    const mockCountries = [

      { name: 'Australia', flag: 'flag-url', region: 'Oceania' },

      { name: 'Brazil', flag: 'flag-url', region: 'Americas' },

    ];

    mockAxiosGet.mockResolvedValue({ data: mockCountries });



    render(<Home />);

    

    // Wait for the countries to be displayed

    await waitFor(() => {

      expect(screen.getByText(/australia/i)).toBeInTheDocument();

      expect(screen.getByText(/brazil/i)).toBeInTheDocument();

    });

  });



  test('filters countries based on search input', async () => {

    // Mock the axios call with sample countries data

    const mockCountries = [

      { name: 'Australia', flag: 'flag-url', region: 'Oceania' },

      { name: 'Brazil', flag: 'flag-url', region: 'Americas' },

    ];

    mockAxiosGet.mockResolvedValue({ data: mockCountries });



    render(<Home />);



    // Wait for countries to be rendered

    await waitFor(() => {

      expect(screen.getByText(/australia/i)).toBeInTheDocument();

      expect(screen.getByText(/brazil/i)).toBeInTheDocument();

    });



    // Simulate user typing "aus" into the search input and wait for the state update

    await act(async () => {

      fireEvent.change(screen.getByPlaceholderText(/enter country name/i), {

        target: { value: 'aus' },

      });

    });



    // Expect Australia to be visible and Brazil not to be

    expect(screen.getByText(/australia/i)).toBeInTheDocument();

    expect(screen.queryByText(/brazil/i)).toBeNull();

  });



  test('filters countries based on selected region', async () => {

    // Mock the axios call with sample countries data

    const mockCountries = [

      { name: 'Australia', flag: 'flag-url', region: 'Oceania' },

      { name: 'Brazil', flag: 'flag-url', region: 'Americas' },

    ];

    mockAxiosGet.mockResolvedValue({ data: mockCountries });



    render(<Home />);



    // Wait for countries to be rendered

    await waitFor(() => {

      expect(screen.getByText(/australia/i)).toBeInTheDocument();

      expect(screen.getByText(/brazil/i)).toBeInTheDocument();

    });



    // Simulate selecting "Oceania" from the region dropdown and wait for the state update

    await act(async () => {

      fireEvent.change(screen.getByLabelText(/filter by region/i), {

        target: { value: 'Oceania' },

      });

    });



    // Expect Australia to be visible and Brazil not to be

    expect(screen.getByText(/australia/i)).toBeInTheDocument();

    expect(screen.queryByText(/brazil/i)).toBeNull();

  });

});