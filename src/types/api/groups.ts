export type Group = {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export type CreateGroupRequest = {
    name: string;
    description: string;
}

export type CreateGroupResponse = {
    group: Group;
}

export type GetGroupResponse = {
    group: Group;
}
