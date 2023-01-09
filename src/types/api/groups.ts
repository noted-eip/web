export type Group = {
    id: string;
    name: string;
    description: string;
    created_at: string;
}

export type GroupMember = {
    account_id: string;
    role: string;
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
    group: Partial<Group>;
    update_mask: string;
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

export type GetGroupMemberRequest = {
    group_id: string;
    account_id: string;
}

export type GetGroupMemberResponse = {
    member: GroupMember;
}

export type UpdateGroupMemberRequest = {
    group_id: string;
    account_id: string;
    member: Partial<GroupMember>;
    update_mask: string;
}

export type UpdateGroupMemberResponse = {
    member: GroupMember;
}

export type RemoveGroupMemberRequest = {
    group_id: string;
    account_id: string;
}

export type RemoveGroupMemberResponse = unknown

export type ListGroupMembersRequest = {
    group_id: string;
    limit?: number;
    offset?: number;
}

export type ListGroupMembersResponse = {
    members: GroupMember[];
}
