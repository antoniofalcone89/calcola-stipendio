import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('./components/CalcolatoreStipendio', () => {
  return function MockCalcolatoreStipendio() {
    return <div>Calcolatore Stipendio</div>;
  };
});

test('renders Calcolatore Stipendio app', () => {
  render(<App />);
  const titleElement = screen.getByText(/calcolatore stipendio/i);
  expect(titleElement).toBeInTheDocument();
});
