export interface Project {
  id: string;
  title: string;
  category: 'academic' | 'personal';
  description: string;
  longDescription: string;
  tags: string[];
  metrics?: { label: string; value: string }[];
  keyFeatures: string[];
}
