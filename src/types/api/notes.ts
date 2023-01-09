export type Block = {
  id: string;
  type: string;
  heading?: string;
  paragraph?: string;
}

export type CreateNotesRequest = {
  title: string;
  blocks?: Block[];
}

export type CreateNotesResponse = {
  id: string;
  title: string;
  author_id: string;
  blocks?: Block[];
  created_at: string;
  modified_at: string;
}

export type GetNoteRequest = {
  note_id: string;
}

export type NoteResponse = {
  id: string;
  author_id: string;
  title: string;
  blocks?: Block[];
  created_at: string;
  modified_at: string;
}

export type GetNoteResponse = {
  note: NoteResponse;
}

export type GetNotesResponse = {
  id: string;
  author_id: string;
  title: string;
  created_at: string;
  modified_at: string;
}