export type tag = 'Todo' | 'Work' | 'Personal' | 'Meeting' | 'Shopping';

export interface Note {
  id: string;
  title: string;
  content: string;
  tag: tag;
}

export interface NoteTag {
  title: string;
  content: string;
  tag: tag;
}
