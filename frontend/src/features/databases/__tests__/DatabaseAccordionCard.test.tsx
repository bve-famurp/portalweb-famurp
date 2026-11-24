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
    logoUrl: '',
    accessUrl: 'https://pubmed.ncbi.nlm.nih.gov/',
    cursos: [
      { idCurso: 56, nombreCurso: 'Biofísica', ciclo: 1, codigoCurso: 'MH-0101' },
      { idCurso: 57, nombreCurso: 'Biología Celular y Molecular', ciclo: 1, codigoCurso: 'MH-0102' },
      { idCurso: 61, nombreCurso: 'Bioestadística y Demografía', ciclo: 2, codigoCurso: 'MH-0204' },
      { idCurso: 63, nombreCurso: 'Bioquímica', ciclo: 3, codigoCurso: 'MH-0302' },
      { idCurso: 66, nombreCurso: 'Farmacología', ciclo: 5, codigoCurso: 'MH-0501' },
    ],
  };

  it('renders maximum 3 curricular courses and shows remaining count badge when expanded', () => {
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

  it('does not render course container when cursos array is empty', () => {
    const emptyCursosDb: MedicalDatabase = {
      ...mockDatabase,
      cursos: [],
    };

    render(
      <DatabaseAccordionCard
        database={emptyCursosDb}
        isExpanded={true}
        onToggle={vi.fn()}
      />
    );

    expect(screen.queryByText('Medicina Humana')).not.toBeInTheDocument();
    expect(screen.queryByText(/^\d+\+$/)).not.toBeInTheDocument();
  });

  it('displays only accessType and hides course names in collapsed header when isExpanded is false', () => {
    const { rerender } = render(
      <DatabaseAccordionCard
        database={mockDatabase}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Acceso Abierto')).toBeInTheDocument();
    expect(screen.queryByText(/Biofísica/)).not.toBeInTheDocument();
    expect(screen.queryByText(/Biología Celular y Molecular/)).not.toBeInTheDocument();

    rerender(
      <DatabaseAccordionCard
        database={{ ...mockDatabase, accessType: 'Suscripción URP' }}
        isExpanded={false}
        onToggle={vi.fn()}
      />
    );

    expect(screen.getByText('Suscripción URP')).toBeInTheDocument();
    expect(screen.queryByText(/Biofísica/)).not.toBeInTheDocument();
  });
});
