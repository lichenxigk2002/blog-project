import { Identifiable, Timestamped, ApiResponse } from './common';

export interface FriendLinks {
    id: number;
    name: string;
    url: string;
    avatarUrl: string;
    status: 'approved' | 'pending';
    description: string;
    createdAt: string;
    updatedAt: string;
}

export interface FriendLinksOperationResponse extends ApiResponse<void> { }