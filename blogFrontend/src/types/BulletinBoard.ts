import { Identifiable, Timestamped, PaginatedResponse } from './common';

export interface BulletinBoardProps extends Identifiable, Timestamped {
  name: string;
  email: string;
  gender: '小哥哥' | '小姐姐';
  content: string;
  status?: 'pending' | 'approved' | 'rejected';
  reply?: string;
  replyTime?: string;
  isPinned?: boolean;
  avatar?: string;
  sendEmail?: boolean;
}

export interface BulletinBoardResponse extends PaginatedResponse<BulletinBoardProps> { }
