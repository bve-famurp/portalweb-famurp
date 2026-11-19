import { describe, it, expect } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { FaqPage } from '../../../pages/FaqPage';
import { FAQ_ITEMS, FAQ_CATEGORIES } from '../data/faqData';

describe('FaqPage and FAQ Data', () => {
  it('contains structured FAQ items mapped to valid categories', () => {
    expect(FAQ_ITEMS.length).toBeGreaterThan(0);
    expect(FAQ_CATEGORIES.length).toBeGreaterThan(0);
    const categoryIds = FAQ_CATEGORIES.map((c) => c.id);
    FAQ_ITEMS.forEach((item) => {
      expect(categoryIds).toContain(item.category);
      expect(item.question.trim().length).toBeGreaterThan(0);
      expect(item.answerHtml.trim().length).toBeGreaterThan(0);
    });
  });

  it('renders the header title in bold with Hero typography', () => {
    render(<FaqPage />);
    const heading = screen.getByRole('heading', { level: 1 });
    expect(heading).toHaveTextContent(/Preguntas\s+Frecuentes/i);
    expect(heading.className).toContain('font-bold');
  });

  it('renders all available FAQ items in the initial "all" category view', () => {
    render(<FaqPage />);
    expect(screen.getByRole('heading', { level: 2, name: 'Todas las Preguntas' })).toBeInTheDocument();
    FAQ_ITEMS.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });
  });

  it('filters questions dynamically by category when clicking a category button', () => {
    render(<FaqPage />);
    const targetCategory = FAQ_CATEGORIES.find((c) => c.id !== 'all')!;
    const categoryButton = screen.getByRole('button', { name: targetCategory.name });
    fireEvent.click(categoryButton);

    expect(screen.getByRole('heading', { level: 2, name: targetCategory.name })).toBeInTheDocument();

    const expectedItems = FAQ_ITEMS.filter((item) => item.category === targetCategory.id);
    const nonExpectedItems = FAQ_ITEMS.filter((item) => item.category !== targetCategory.id);

    expectedItems.forEach((item) => {
      expect(screen.getByText(item.question)).toBeInTheDocument();
    });

    nonExpectedItems.forEach((item) => {
      expect(screen.queryByText(item.question)).not.toBeInTheDocument();
    });
  });

  it('expands and collapses an accordion question on click', () => {
    render(<FaqPage />);
    const firstItem = FAQ_ITEMS[0];
    const trigger = screen.getByText(firstItem.question);
    const triggerButton = trigger.closest('button')!;

    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');

    fireEvent.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'true');

    fireEvent.click(triggerButton);
    expect(triggerButton).toHaveAttribute('aria-expanded', 'false');
  });

  it('expands and collapses all items when clicking toggle all button', () => {
    render(<FaqPage />);
    const toggleAllBtn = screen.getByRole('button', { name: 'Expand All +' });

    fireEvent.click(toggleAllBtn);
    expect(screen.getByRole('button', { name: 'Collapse All -' })).toBeInTheDocument();

    const triggers = screen.getAllByRole('button', { expanded: true });
    expect(triggers.length).toBe(FAQ_ITEMS.length);

    fireEvent.click(screen.getByRole('button', { name: 'Collapse All -' }));
    expect(screen.getByRole('button', { name: 'Expand All +' })).toBeInTheDocument();

    const closedTriggers = screen.getAllByRole('button', { expanded: false });
    expect(closedTriggers.length).toBe(FAQ_ITEMS.length);
  });

  it('renders the regulation aside image with straight borders', () => {
    render(<FaqPage />);
    const image = screen.getByAltText(
      'Reglamento Interno de la Biblioteca Virtual y Especializada FAMURP'
    );
    expect(image).toBeInTheDocument();
    expect(image).toHaveAttribute('src', '/images/reglamento-interno-bve.webp');
    expect(image.className).toContain('rounded-none');
  });

  it('opens zoom view when clicking on regulation image and closes on close button', () => {
    render(<FaqPage />);
    const thumb = screen.getByAltText(
      'Reglamento Interno de la Biblioteca Virtual y Especializada FAMURP'
    );
    expect(screen.queryByRole('dialog', { name: 'Ampliación del reglamento' })).not.toBeInTheDocument();

    fireEvent.click(thumb);
    expect(screen.getByRole('dialog', { name: 'Ampliación del reglamento' })).toBeInTheDocument();

    const closeBtn = screen.getByRole('button', { name: 'Cerrar ampliación' });
    fireEvent.click(closeBtn);
    expect(screen.queryByRole('dialog', { name: 'Ampliación del reglamento' })).not.toBeInTheDocument();
  });

  it('closes zoom view when clicking on overlay background or pressing Escape', () => {
    render(<FaqPage />);
    const thumb = screen.getByAltText(
      'Reglamento Interno de la Biblioteca Virtual y Especializada FAMURP'
    );

    fireEvent.click(thumb);
    const dialog = screen.getByRole('dialog', { name: 'Ampliación del reglamento' });
    expect(dialog).toBeInTheDocument();

    fireEvent.click(dialog);
    expect(screen.queryByRole('dialog', { name: 'Ampliación del reglamento' })).not.toBeInTheDocument();

    fireEvent.click(thumb);
    expect(screen.getByRole('dialog', { name: 'Ampliación del reglamento' })).toBeInTheDocument();

    fireEvent.keyDown(window, { key: 'Escape' });
    expect(screen.queryByRole('dialog', { name: 'Ampliación del reglamento' })).not.toBeInTheDocument();
  });
});
