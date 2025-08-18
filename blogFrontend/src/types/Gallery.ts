// blogFrontend/src/types/Gallery.ts
export interface Gallery {
  id: number;
  title: string;
  description: string;
  coverImage?: string;
  category: string;
  date: string;
  createdAt: string;
  updatedAt: string;
}

export type GalleryCreate = Omit<Gallery, 'id' | 'date'>;