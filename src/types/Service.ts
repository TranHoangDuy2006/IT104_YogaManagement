export interface Service {
  id: string;
  name: string;
  description: string;
  isActive: boolean;
  imageUrl?: string;
  courses?: string[];
}
