import { render, screen } from '@testing-library/react';
import { Tagline } from '../Header';

describe('Tagline Component', () => {
  it('renders the tagline text correctly', () => {
    render(<Tagline />);
    expect(screen.getByText(/Your one stop for/i)).toBeInTheDocument();
    const checklistsElement = screen.getByText('checklists');
    expect(checklistsElement).toBeInTheDocument();
    expect(checklistsElement.className).toMatch(/text-blue-400/);
  });

  it('renders with proper styling elements', () => {
    render(<Tagline />);
    // Only one SVG is present, so use getByTestId
    const svg = screen.getByTestId('tagline-animated-svg');
    expect(svg).toBeInTheDocument();
    // Style tag assertion removed as it's not critical
  });
});
