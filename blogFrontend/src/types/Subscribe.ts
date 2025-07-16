export interface Subscribe {
    email: string; // 用户的电子邮件地址
    name: string; // 用户的姓名（可选）
}

export interface SubscribeResponse {
    success: boolean;
    message: string;
}