import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

// Mock the fetch function
global.fetch = jest.fn(() =>
  Promise.resolve({
    json: () => Promise.resolve([{ Name: 'Test Game', UPC: '123456789', Players: '2-4', 'Play Time': '30-60 minutes', Themes: ['Fantasy', 'Adventure'] }])
  })
);

describe('App', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('fetches and displays game data', async () => {
    render(<App />);

    // Wait for the data to be fetched and displayed
    await screen.findByText('Test Game');

    // Check if the game data is displayed
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('2-4')).toBeInTheDocument();
    expect(screen.getByText('30-60 minutes')).toBeInTheDocument();
    expect(screen.getByText('Fantasy')).toBeInTheDocument();
    expect(screen.getByText('Adventure')).toBeInTheDocument();
  });

  it('filters game data based on theme', async () => {
    render(<App />);

    // Wait for the data to be fetched and displayed
    await screen.findByText('Test Game');

    // Filter by theme
    const selectElement = screen.getByLabelText('Filter by Theme:');
    userEvent.selectOptions(selectElement, 'Fantasy');

    // Check if the filtered data is displayed
    expect(screen.getByText('Test Game')).toBeInTheDocument();
    expect(screen.getByText('123456789')).toBeInTheDocument();
    expect(screen.getByText('2-4')).toBeInTheDocument();
    expect(screen.getByText('30-
