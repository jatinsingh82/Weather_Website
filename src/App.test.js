import { render, screen } from '@testing-library/react';
import App from './App';

test('renders WeatherNow header and brand without crashing', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/WEATHER/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

test('renders search input for global locations', () => {
  render(<App />);
  const searchInput = screen.getByPlaceholderText(/search global city/i);
  expect(searchInput).toBeInTheDocument();
});

test('does not contain any portfolio or cybersim references', () => {
  render(<App />);
  expect(screen.queryByText(/Jatin Singh/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/CyberSim/i)).not.toBeInTheDocument();
  expect(screen.queryByText(/Cybersecurity Analyst/i)).not.toBeInTheDocument();
});
