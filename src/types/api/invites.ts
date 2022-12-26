export type Invite = {
    id: string;
    sender_account_id: string;
    recipient_account_id: string;
    group_id: string;
}

export type SendInviteRequest = {
    group_id: string;
    recipient_account_id: string;
}

export type SendInviteResponse = {
    invite: Invite;
}

export type ListInvitesRequest = {
    sender_account_id?: string;
    recipient_account_id?: string;
    group_id?: string;
    offset?: number;
    limit?: number;
}

export type ListInvitesResponse = {
    invites: Invite[];
}
