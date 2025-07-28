import { http } from '@/http/request';
import { ThoughtsProps } from "@/types/Thoughts";

export const ThoughtsAPI = {
    getAllThoughts: () => http.get<ThoughtsProps[]>('/thoughts'),

    getThoughtById: (id: number) => http.get<ThoughtsProps>(`/thoughts/${id}`),

    createThought: (data: ThoughtsProps) => http.post<boolean>('/thoughts', data),

    updateThought: (data: ThoughtsProps) => http.put<boolean>('/thoughts', data),

    deleteThought: (id: number) => http.delete<boolean>(`/thoughts/${id}`)
}
