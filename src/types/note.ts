export type tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  tag: tag;
}

export interface NewNote {
  title: string;
  content: string;
  tag: tag;
}
