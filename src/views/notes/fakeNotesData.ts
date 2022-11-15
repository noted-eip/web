export interface INotes {
  groupName: string;
  notesNbr: number;
  creationDate: string;
  modifiedDate: string;
}

export const fakeNotes: INotes = {
  groupName: 'Maths',
  notesNbr: 15,
  creationDate: '15/10/2022',
  modifiedDate: '15/10/2022 : 13h55'
}