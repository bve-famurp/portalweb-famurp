import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { BentoBoletinCard } from '../components/BentoBoletinCard';
import { boletinSlideService } from '../services/boletinSlideService';
import { FormatoSlide } from '../types/boletinSlide.types';

vi.mock('../services/boletinSlideService', async () => {
  const actual = await vi.importActual<any>('../services/boletinSlideService');
  return {
    ...actual,
    boletinSlideService: {
      getBoletinSlides: vi.fn(),
    },
  };
});

describe('BentoBoletinCard', () => {
  const mockSlides = [
    {
      idSlide: 1,
      titulo: 'Afiche Vertical de Prueba',
      descripcion: null,
      imagenUrl: '/carousel/infografia-clinicalkey.png',
      formato: FormatoSlide.Vertical,
      enlaceUrl: 'https://www.clinicalkey.com',
    },
    {
      idSlide: 2,
      titulo: 'Boletín Bipartito de Prueba',
      descripcion: 'Descripción del comunicado médico institucional.',
      imagenUrl: '/carousel/capacitacion-accessmedicina.jpg',
      formato: FormatoSlide.Bipartito,
      enlaceUrl: 'https://accessmedicina.mhmedical.com',
    },
  ];

  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(boletinSlideService.getBoletinSlides).mockResolvedValue(mockSlides);
  });

  it('renders initial vertical slide and external link button', async () => {
    render(<BentoBoletinCard />);

    await waitFor(() => {
      expect(screen.getByAltText('Afiche Vertical de Prueba')).toBeInTheDocument();
    });

    const link = screen.getByTitle('Abrir enlace oficial');
    expect(link).toBeInTheDocument();
    expect(link).toHaveAttribute('href', 'https://www.clinicalkey.com');
  });

  it('navigates to next bipartite slide when clicking next button', async () => {
    render(<BentoBoletinCard />);

    await waitFor(() => {
      expect(screen.getByAltText('Afiche Vertical de Prueba')).toBeInTheDocument();
    });

    const nextBtn = screen.getByLabelText('Siguiente afiche');
    fireEvent.click(nextBtn);

    expect(screen.getByText('Boletín Bipartito de Prueba')).toBeInTheDocument();
    expect(screen.getByText('Descripción del comunicado médico institucional.')).toBeInTheDocument();
  });

  it('opens and closes pure lightbox modal on image click and close button', async () => {
    render(<BentoBoletinCard />);

    await waitFor(() => {
      expect(screen.getByAltText('Afiche Vertical de Prueba')).toBeInTheDocument();
    });

    const slideContainer = screen.getByAltText('Afiche Vertical de Prueba').parentElement;
    if (slideContainer) {
      fireEvent.click(slideContainer);
    }

    const modalDialog = screen.getByRole('dialog', { name: 'Ampliación de imagen' });
    expect(modalDialog).toBeInTheDocument();
    expect(screen.getByAltText('Ampliación de afiche')).toBeInTheDocument();

    const closeBtn = screen.getByLabelText('Cerrar ampliación');
    fireEvent.click(closeBtn);

    expect(screen.queryByRole('dialog', { name: 'Ampliación de imagen' })).not.toBeInTheDocument();
  });

  it('closes lightbox modal on Escape key press', async () => {
    render(<BentoBoletinCard />);

    await waitFor(() => {
      expect(screen.getByAltText('Afiche Vertical de Prueba')).toBeInTheDocument();
    });

    const slideContainer = screen.getByAltText('Afiche Vertical de Prueba').parentElement;
    if (slideContainer) {
      fireEvent.click(slideContainer);
    }

    expect(screen.getByRole('dialog', { name: 'Ampliación de imagen' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });

    expect(screen.queryByRole('dialog', { name: 'Ampliación de imagen' })).not.toBeInTheDocument();
  });
});
