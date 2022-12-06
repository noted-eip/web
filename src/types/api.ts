export type Account = {
    id: string;
    name: string;
    email: string;
}

export type Note = {
    id: string;
    title: string;
    content?: string[];
}

export type CreateAccountRequest = {
    name: string;
    email: string;
    password: string;
}

export type CreateAccountResponse = {
    account: Account;
}

export type GetAccountRequest = {
    id: string;
    email: string;
}

export type GetAccountResponse = {
    account: Account;
}

export type AuthenticateRequest = {
    email: string;
    password: string;
}

export type AuthenticateResponse = {
    token: string;
}

export type CreateNoteRequest = {
    note: Note;
}

export type GetNoteRequest = {
    note: Note;
}
