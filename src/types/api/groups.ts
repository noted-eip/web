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

export type GetGroupRequest = {
    group_id: string;    
}

export type GetGroupResponse = {
    group: Group;
}

export type UpdateGroupRequest = {
    group_id: string;
}

export type UpdateGroupResponse = {
    group: Group;
}

export type ListGroupsRequest = {
    account_id: string;
    offset?: number;
    limit?: number;
}

export type ListGroupsResponse = {
    groups: Group[];
}
