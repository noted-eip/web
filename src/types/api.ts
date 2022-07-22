export type Account = {
    id: string;
    name: string;
    email: string;
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
