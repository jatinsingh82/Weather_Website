import { render, screen } from '@testing-library/react';
import App from './App';

test('renders Jatin Singh portfolio headline without crashing', () => {
  render(<App />);
  const heroElements = screen.getAllByText(/Jatin Singh/i);
  expect(heroElements.length).toBeGreaterThan(0);
});

test('renders CyberSim flagship showcase', () => {
  render(<App />);
  const cyberElements = screen.getAllByText(/CyberSim/i);
  expect(cyberElements.length).toBeGreaterThan(0);
});
