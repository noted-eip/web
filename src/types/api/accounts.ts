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
    account_id?: string;
    email?: string;
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

export type UpdateAccountRequest = {
    account: Partial<Account>;
    update_mask: string;
}

export type UpdateAccountResponse = {
    account: Account;
}