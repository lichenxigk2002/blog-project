import { http } from '@/utils/request';
import { SubscribeResponse } from "@/types/Subscribe";

export interface Subscriber {
    id: number;
    email: string;
    name: string;
    subscribed: boolean;
    subscribeTime: string;
}

export const SubscribeAPI = {
    createSubscribe: (email: string, name: string) =>
        http.post<SubscribeResponse>('/subscribe_emails/subscribe', { email, name }),

    getSubscribers: () =>
        http.get<{ success: boolean; data: Subscriber[] }>('/subscribe_emails/list'),
}