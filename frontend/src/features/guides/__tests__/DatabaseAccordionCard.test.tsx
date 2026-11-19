import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { DatabaseAccordionCard } from '../components/directory/DatabaseAccordionCard';
import { MedicalDatabase } from '../data/databasesData';

describe('DatabaseAccordionCard', () => {
  const mockDatabase: MedicalDatabase = {
    id: 'db-1',
    rawId: 1,
    title: 'PubMed',
    description: 'Motor de búsqueda bibliográfica biomédica.',
    accessType: 'Acceso Abierto',
    logoFile: '',
    accessUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    tags: [
      'Biofísica',
      'Biología Celular y Molecular',
      'Bioestadística y Demografía',
      'Bioquímica',
      'Farmacología',
    ],
  };

  it('renders maximum 3 tags and shows remaining count badge when expanded', () => {
    render(
      <DatabaseAccordionCard
        database={mockDatabase}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Biofísica')).toBeInTheDocument();
    expect(screen.getByText('Biología Celular y Molecular')).toBeInTheDocument();
    expect(screen.getByText('Bioestadística y Demografía')).toBeInTheDocument();

    expect(screen.queryByText('Bioquímica')).not.toBeInTheDocument();
    expect(screen.queryByText('Farmacología')).not.toBeInTheDocument();

    expect(screen.getByText('2+')).toBeInTheDocument();
  });

  it('does not render tag container or arbitrary fallback when tags array is empty', () => {
    const emptyTagsDb: MedicalDatabase = {
      ...mockDatabase,
      tags: [],
    };

    render(
      <DatabaseAccordionCard
        database={emptyTagsDb}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.queryByText('Medicina Humana')).not.toBeInTheDocument();
    expect(screen.queryByText(/\[\d+\+\]/)).not.toBeInTheDocument();
  });
});
