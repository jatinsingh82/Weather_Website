import { render, screen } from '@testing-library/react';
import App from './App';

test('renders WeatherNow app without crashing', () => {
  render(<App />);
  const brandElements = screen.getAllByText(/WeatherNow/i);
  expect(brandElements.length).toBeGreaterThan(0);
});

