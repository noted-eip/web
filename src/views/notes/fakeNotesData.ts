export interface INotes {
  groupName: string;
  notesNbr: number;
  creationDate: string;
  modifiedDate: string;
}

export interface INote {
  name: string;
  firstChars: string;
}

export const fakeGroup: INotes = {
  groupName: 'Maths',
  notesNbr: 15,
  creationDate: '15/10/2022',
  modifiedDate: '15/10/2022 : 13h55'
}

export const fakeNotes: INote[] = [
  {name: 'Arithmétique 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Arithmétique 2', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Blabla 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Blibli 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Kakao 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Musique 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'},
  {name: 'Physique 1', firstChars: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quisque interdum in metus id porttitor. Phasellus.'}
]
