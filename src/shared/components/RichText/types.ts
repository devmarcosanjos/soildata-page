export type TextPart = 
  | { type: 'text'; content: string }
  | { type: 'bold'; content: string }
  | { type: 'link'; content: string; href: string; target?: '_blank' | '_self' }
  | { type: 'colored'; content: string; color: string };

export type SectionItem =
  | { type: 'paragraph'; text: string | TextPart[] }
  | { type: 'subtitle'; text: string | TextPart[] }
  | { type: 'list'; items: (string | TextPart[])[] };

export type Section = {
  title?: string;
  items: SectionItem[];
};

