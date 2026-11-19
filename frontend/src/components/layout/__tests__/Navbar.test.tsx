import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Navbar } from '../Navbar';

describe('Navbar Component', () => {
  it('renders "Preguntas Frecuentes" navigation button and calls onNavigate with "faq"', () => {
    const handleNavigate = vi.fn();
    render(<Navbar currentView="home" onNavigate={handleNavigate} />);

    const faqButtons = screen.getAllByRole('button', { name: 'Preguntas Frecuentes' });
    expect(faqButtons.length).toBeGreaterThan(0);

    fireEvent.click(faqButtons[0]);
    expect(handleNavigate).toHaveBeenCalledWith('faq');
  });
});
