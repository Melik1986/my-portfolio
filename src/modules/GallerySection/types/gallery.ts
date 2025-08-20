export type GalleryClassName =
  | 'sunrise'
  | 'rocky'
  | 'forest'
  | 'meadow'
  | 'lake'
  | 'clouds'
  | 'riverbank'
  | 'ridges'
  | 'cliffs'
  | 'valley';

export interface GalleryItem {
  className: GalleryClassName;
  title: string;
  name: string;
  description: string;
}
