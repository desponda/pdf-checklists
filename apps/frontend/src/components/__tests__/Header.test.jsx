import { render, screen } from '@testing-library/react';
import Header from '../Header';

describe('Header Component', () => {
  it('renders the header with title', () => {
    render(<Header />);
    expect(screen.getByText('Flight Simulation Checklists')).toBeInTheDocument();
  });

  it('renders the version number', () => {
    render(<Header />);
    expect(screen.getByText('v1.0')).toBeInTheDocument();
  });

  it('renders the tagline', () => {
    render(<Header />);
    expect(screen.getByText('Your one stop shop for checklists')).toBeInTheDocument();
  });
}); 