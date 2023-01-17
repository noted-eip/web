export type Block = {
  id: string;
  type: string;
  heading?: string;
  paragraph?: string;
}

export type Note = {
  id: string;
  title: string;
  author_id: string;
  blocks?: Block[];
  created_at: string;
  modified_at: string;
}

export type CreateNoteRequest = {
  group_id: string;
  note: { title: string, author_id: string };
}

export type CreateNoteResponse = {
  note: Note;
}

export type GetNoteRequest = {
  note_id: string;
}

export type GetNoteResponse = {
  note: Note;
}

export type GetNotesResponse = {
  id: string;
  author_id: string;
  title: string;
  created_at: string;
  modified_at: string;
}

export type ListNotesRequest = {
  author_id: string;
}

export type ListNotesResponse = {
  notes: Note[];
}

export type InsertBlockRequest = {
  note_id: string; 
  block: Omit<Block, 'id'>
  index: number
}

export type InsertBlockResponse = {
  block: Block
}
