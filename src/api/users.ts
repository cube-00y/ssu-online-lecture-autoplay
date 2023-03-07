import { api } from './base';

type Activitie = {
  course_format: 'online' | 'offline' | 'none';
  id: number;
  name: string;
  professors: string;
  total_students: number;
};

// https://canvas.ssu.ac.kr/learningx/api/v1/learn_activities/learnstatus?term_ids=26&type=subsection
// /users/${userId}/learn_activities?term_ids=${term_id}`, token);
export function learnActivities ({ userId, token, term_id }: { userId: string, token: string, term_id: number }) {
  return api<Activitie[]>(`/learn_activities/courses?term_ids[]=${term_id}`, token);
}
