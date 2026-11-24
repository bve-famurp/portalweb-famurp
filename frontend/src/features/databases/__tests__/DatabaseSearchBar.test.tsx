import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { DatabaseSearchBar } from '../components/DatabaseSearchBar';

describe('DatabaseSearchBar', () => {
  it('renders input with default and customized placeholders', () => {
    const { rerender } = render(
      <DatabaseSearchBar
        searchTerm=""
        onSearchChange={vi.fn()}
      />
    );

    expect(
      screen.getByPlaceholderText('Buscar base de datos, por asignatura académica o recurso...')
    ).toBeInTheDocument();

    rerender(
      <DatabaseSearchBar
        searchTerm=""
        onSearchChange={vi.fn()}
        placeholder="Buscar recursos de farmacología..."
      />
    );

    expect(
      screen.getByPlaceholderText('Buscar recursos de farmacología...')
    ).toBeInTheDocument();
  });

  it('calls onSearchChange when typing in the input', () => {
    const handleSearchChange = vi.fn();
    render(
      <DatabaseSearchBar
        searchTerm=""
        onSearchChange={handleSearchChange}
      />
    );

    const input = screen.getByRole('textbox');
    fireEvent.change(input, { target: { value: 'Medicina Interna' } });

    expect(handleSearchChange).toHaveBeenCalledWith('Medicina Interna');
  });

  it('renders clear button when searchTerm is present and clears text on click in panel variant', () => {
    const handleSearchChange = vi.fn();
    const { rerender } = render(
      <DatabaseSearchBar
        searchTerm=""
        onSearchChange={handleSearchChange}
      />
    );

    expect(screen.queryByTitle('Limpiar búsqueda')).not.toBeInTheDocument();

    rerender(
      <DatabaseSearchBar
        searchTerm="Cardiología"
        onSearchChange={handleSearchChange}
      />
    );

    const clearButton = screen.getByTitle('Limpiar búsqueda');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleSearchChange).toHaveBeenCalledWith('');
  });

  it('renders clear button and clears search in hero variant', () => {
    const handleSearchChange = vi.fn();
    render(
      <DatabaseSearchBar
        variant="hero"
        searchTerm="Pediatría"
        onSearchChange={handleSearchChange}
      />
    );

    const clearButton = screen.getByTitle('Limpiar búsqueda');
    expect(clearButton).toBeInTheDocument();

    fireEvent.click(clearButton);
    expect(handleSearchChange).toHaveBeenCalledWith('');
  });
});
