import { render, screen } from '@testing-library/react';
import { Tagline } from '../Header';

describe('Tagline Component', () => {
  it('renders the tagline text', () => {
    render(<Tagline />);
    expect(screen.getByText('Your one stop for checklists')).toBeInTheDocument();
  });
});
