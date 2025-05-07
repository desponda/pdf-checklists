import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {

  it('renders the version number', () => {
    render(<Header />);
    const versionElement = screen.getByText('v1.0');
    expect(versionElement).toBeInTheDocument();
    expect(versionElement).toHaveClass('text-blue-300');
  });
  
  it('renders the JetIcon', () => {
    render(<Header />);
    const svg = screen.getByTestId('jet-icon-svg');
    expect(svg).toBeInTheDocument();
    expect(svg).toHaveAttribute('width', '28');
    expect(svg).toHaveAttribute('height', '28');
  });

  it('has proper structure and styling', () => {
    render(<Header />);
    const mainContainer = screen.getByTestId('header-main-container');
    expect(mainContainer).toBeInTheDocument();
    expect(mainContainer.className).toMatch(/bg-zinc-900\/95/);
    expect(mainContainer.className).toMatch(/border-blue-900\/40/);
  });

  it('highlights "Simulation" in blue', () => {
    render(<Header />);
    const simulationText = screen.getByText('Simulation');
    expect(simulationText.className).toMatch(/text-blue-400/);
  });
});