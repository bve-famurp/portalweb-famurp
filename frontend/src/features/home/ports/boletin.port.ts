import { BoletinSlide } from '../types/boletinSlide.types';

export interface BoletinPort {
  getSlides(): Promise<BoletinSlide[]>;
}
