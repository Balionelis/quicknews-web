export interface Article {
  title: string;
  description: string;
  url: string;
  publishedAt: string;
  source: {
    name: string;
  };
}

export interface Language {
  code: string;
  name: string;
}

export interface DateRange {
  id: string;
  label: string;
  value: number; // days
}