import { vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import AircraftSelector from '../AircraftSelector';

// Mock data for testing
const mockAircraftData = {
  "b737": {
    category: "airliner",
    standard: {
      name: "Boeing 737",
      // Add other required properties
    }
  },
  "c172": {
    category: "general_aviation",
    standard: {
      name: "Cessna 172",
      // Add other required properties
    }
  },
  "ah64": {
    category: "helicopter",
    standard: {
      name: "Apache AH-64",
      // Add other required properties
    }
  },
  "f16": {
    category: "military",
    standard: {
      name: "F-16 Fighting Falcon",
      // Add other required properties
    },
    variants: {
      dark: {
        // Dark variant properties
      }
    }
  }
};

describe('AircraftSelector Component', () => {
  const mockOnSelect = vi.fn();
  const mockOnGenerate = vi.fn();
  
  beforeEach(() => {
    mockOnSelect.mockReset();
    mockOnGenerate.mockReset();
  });
  
  it('renders all aircraft cards', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Check if all aircraft names are rendered
    expect(screen.getByText('Boeing 737')).toBeInTheDocument();
    expect(screen.getByText('Cessna 172')).toBeInTheDocument();
    expect(screen.getByText('Apache AH-64')).toBeInTheDocument();
    expect(screen.getByText('F-16 Fighting Falcon')).toBeInTheDocument();
  });
  
  it('filters aircraft based on search input', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Search for Boeing
    const searchInput = screen.getByPlaceholderText('Search aircraft...');
    fireEvent.change(searchInput, { target: { value: 'Boeing' } });
    
    // Only Boeing 737 should be visible
    expect(screen.getByText('Boeing 737')).toBeInTheDocument();
    expect(screen.queryByText('Cessna 172')).not.toBeInTheDocument();
    expect(screen.queryByText('Apache AH-64')).not.toBeInTheDocument();
    
    // Clear search to verify all appear again
    fireEvent.change(searchInput, { target: { value: '' } });
    expect(screen.getByText('Boeing 737')).toBeInTheDocument();
    expect(screen.getByText('Cessna 172')).toBeInTheDocument();
  });
  
  it('filters aircraft by category', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Select Airliners category
    const categorySelect = screen.getByLabelText('Filter by aircraft category');
    fireEvent.change(categorySelect, { target: { value: 'Airliners' } });
    
    // Only Boeing 737 should be visible
    expect(screen.getByText('Boeing 737')).toBeInTheDocument();
    expect(screen.queryByText('Cessna 172')).not.toBeInTheDocument();
    expect(screen.queryByText('Apache AH-64')).not.toBeInTheDocument();
  });
  
  it('shows the correct count of displayed aircraft', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Target the specific element by its class
    const countElements = screen.getAllByText((content, node) => {
      return node.classList && 
             node.classList.contains('text-zinc-400') && 
             node.textContent.includes('Showing') && 
             node.textContent.includes('4') && 
             node.textContent.includes('aircraft');
    });
    
    expect(countElements.length).toBeGreaterThan(0);

    const categorySelect = screen.getByLabelText('Filter by aircraft category');
    fireEvent.change(categorySelect, { target: { value: 'Military' } });

    // Check for the updated count
    const updatedCountElements = screen.getAllByText((content, node) => {
      return node.classList && 
             node.classList.contains('text-zinc-400') && 
             node.textContent.includes('Showing') && 
             node.textContent.includes('1') && 
             node.textContent.includes('aircraft');
    });
    
    expect(updatedCountElements.length).toBeGreaterThan(0);
  });
  
  it('calls onSelect and onGenerate when an aircraft card is clicked', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Click on Boeing 737
    fireEvent.click(screen.getByRole('button', { name: /Boeing 737/i }));
    
    // Check if the callbacks were called with the right parameters
    expect(mockOnSelect).toHaveBeenCalledWith('b737', 'standard');
    expect(mockOnGenerate).toHaveBeenCalledWith('b737', 'standard');
  });
  
  it('shows selected aircraft with visual indicator', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft="b737"
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Find the card for Boeing 737 and check for selection styling
    const b737Button = screen.getByRole('button', { name: /Boeing 737/i });
    expect(b737Button).toHaveAttribute('aria-pressed', 'true');
    expect(b737Button.className).toMatch(/border-blue-500/);
  });
  
  it('disables interaction when generating PDF', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft="b737"
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={true}
      />
    );
    
    // Try clicking on Cessna 172
    fireEvent.click(screen.getByRole('button', { name: /Cessna 172/i }));
    
    // Callbacks should not have been called
    expect(mockOnSelect).not.toHaveBeenCalled();
    expect(mockOnGenerate).not.toHaveBeenCalled();
  });
  
  it('shows spinner on selected aircraft when generating PDF', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft="b737"
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={true}
      />
    );
    
    // Check for spinner text on the selected aircraft
    expect(screen.getByText('Generating PDF...')).toBeInTheDocument();
  });
  
  it('prefers dark variants when preferDarkChecklist is true', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={true}
        generatingPDF={false}
      />
    );
    
    // Click on F-16 which has a dark variant
    fireEvent.click(screen.getByRole('button', { name: /F-16 Fighting Falcon/i }));
    
    // Check if the callbacks were called with dark variant
    expect(mockOnSelect).toHaveBeenCalledWith('f16', 'dark');
    expect(mockOnGenerate).toHaveBeenCalledWith('f16', 'dark');
  });
  
  it('shows no results message when search has no matches', () => {
    render(
      <AircraftSelector 
        aircraftData={mockAircraftData}
        selectedAircraft={null}
        onSelect={mockOnSelect}
        onGenerate={mockOnGenerate}
        preferDarkChecklist={false}
        generatingPDF={false}
      />
    );
    
    // Search for something that doesn't exist
    const searchInput = screen.getByPlaceholderText('Search aircraft...');
    fireEvent.change(searchInput, { target: { value: 'does not exist' } });
    
    // Should show no results message
    expect(screen.getByText('No aircraft found matching your search criteria.')).toBeInTheDocument();
  });
});