import { render, screen } from '@testing-library/react';
import App from './App';

jest.mock('react-tradingview-embed', () => ({
  AdvancedChart: () => <div data-testid="advanced-chart" />,
}));

jest.mock('./components/SaitoPrice', () => () => (
  <div>
    <button type="button">Price USD</button>
    <article className="ticker_card">Pair card</article>
  </div>
));

beforeEach(() => {
  global.fetch = jest.fn(() =>
    Promise.resolve({
      json: () =>
        Promise.resolve({
          tickers: [{ volume: 1, converted_last: { usd: 0.01 } }],
        }),
    })
  );
});

test('renders the ticker dashboard', async () => {
  render(<App />);

  expect(screen.getByText(/SAITO Ticker/i)).toBeInTheDocument();
  expect(await screen.findByText(/SAITO Ticker - 0.010000/i)).toBeInTheDocument();
  expect(screen.getByRole('button', { name: /Price USD/i })).toBeInTheDocument();
  expect(screen.getByTestId('advanced-chart')).toBeInTheDocument();
});
