export type FaqCategoryId =
  | 'all'
  | 'digital'
  | 'lab'
  | 'prestamos'
  | 'tramites'
  | 'investigacion'
  | 'horarios';

export interface FaqCategory {
  id: FaqCategoryId;
  name: string;
}

export interface FaqItem {
  id: number;
  category: FaqCategoryId;
  question: string;
  answerHtml: string;
}
