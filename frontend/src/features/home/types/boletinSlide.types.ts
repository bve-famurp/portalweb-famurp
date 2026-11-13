export enum FormatoSlide {
  Vertical = 1,
  Bipartito = 2,
}

export interface BoletinSlide {
  idSlide: number;
  titulo: string;
  descripcion: string | null;
  imagenUrl: string;
  formato: 1 | 2;
  enlaceUrl: string | null;
}

export type BoletinSlideDto = BoletinSlide;
