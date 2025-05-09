import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {

  it('renders the version number', () => {
    render(<Header />);
    const versionElement = screen.getByText('v1.0');
    expect(versionElement).toBeInTheDocument();
    expect(versionElement).toHaveClass('text-blue-300');
  });

  it('highlights "Simulation" in blue', () => {
    render(<Header />);
    const simulationText = screen.getByText('Simulation');
    expect(simulationText.className).toMatch(/text-blue-400/);
  });
});