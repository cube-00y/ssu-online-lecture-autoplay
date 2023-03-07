import { api } from './base';

export type Component = {
  assignment_id: number;
  attendance_status: 'attendance' | 'none';
  commons_content: {
    content_id: string;
    content_type: string;
    duration: number;
    progress_support: number;
    thumbnail_url: string;
    view_url: string;
  };
  completed: boolean;
  component_id: number;
  description: string;
  due_at: string;
  external_extra_vars: {
    canvas_content_id: number;
  };
  grade: string;
  grading_type: string;
  has_error_external_url: boolean;
  is_master_course_child_content: boolean;
  late_at: null | string;
  lock_at: string;
  muted: boolean;
  omit_from_final_grade: boolean;
  opened: boolean;
  points_possible: number;
  position: number;
  score: number;
  submission_types: string[];
  submitted: boolean;
  title: string;
  type: string;
  unlock_at: string;
  use_attendance: boolean;
  view_info: {
    view_url: string;
  };
};

export type Section = {
  due_at: string;
  has_component: boolean;
  is_master_course_child_content: boolean;
  late_at: string;
  lock_at: null | string;
  position: number;
  published: null | string;
  section_id: number;
  subsections: {
    is_master_course_child_content: boolean;
    position: number;
    subsection_id: number;
    title: string;
    units: {
      components: {
        component_id: number;
        position: number;
        published: string | null;
        title: string;
      }[];
      position: number;
      title: string;
      unit_id: number;
    }[];
  }[];
  title: string;
  unlock_at: string;
};

type CourseResponse = {
  module_id: number;
  module_items: CourseItem[];
  position: number;
  published: any;
  title: string;
  unlock_at: any;
}

type CourseContentDataItem = {
  course_id: number;
  created_at: string;
  description: string;
  due_at?: any;
  item_content_data: {
    content_id: string;
    content_type: string;
    created_at: string;
    file_name: string;
    progress_support: boolean;
    thumbnail_url: string;
    updated_at: string;
    view_url: string;
    duration?: number;
    _id: string;
  }
  item_content_id: string;
  item_content_type: string;
  item_id: number;
  late_at?: any;
  lecture_period_status: string;
  lesson_position: number;
  lock_at?: any;
  opened: boolean;
  original_item_id: number;
  published: boolean;
  title: string;
  unlock_at?: any;
  updated_at: string;
  use_attendance: boolean;
  week_position: number;
}

type CourseItem = {
  content_data?: CourseContentDataItem;
  content_id: number;
  content_type: string;
  indent: number;
  module_item_id: number;
  position: number;
  published?: any;
  title: string;
  url: string;
}

type AttendanceResponse = CourseContentDataItem & {
  name: string;
  professors?: string;
  attendance_data: {
    attendance_status: string;
    completed: boolean;
    last_at: number;
    progress: number;
  }
  viewer_url: string;
}

export type AttendanceItem = AttendanceResponse & CourseItem

export function components (props: { user_id: string; user_login: string; role: string; token: string, courseId: number; }) {
  const { user_id, user_login, role, token, courseId } = props;
  return api<Component[]>(`/courses/${courseId}/allcomponents_db?user_id=${user_id}&user_login=${user_login}&role=${role}`, token);
}

// 강의의 모든 주차 학습을 불러옴
export function getAllCourse (props: { coursesId: number, token: string }) {
  const { coursesId, token } = props
  return api<CourseResponse[]>(`/courses/${coursesId}/modules?include_detail=true`, token)
}

export function getAttendance (props: { courseId: number, itemId: number, token: string }) {
  const { token, courseId, itemId } = props
  return api<AttendanceResponse>(`/courses/${courseId}/attendance_items/${itemId}`, token)
}

export function sections (props: { user_id: string; user_login: string; role: string; token: string, courseId: number; }) {
  const { user_id, user_login, role, token, courseId } = props;
  return api<Section[]>(`/courses/${courseId}/sections_db?user_id=${user_id}&user_login=${user_login}&role=${role}`, token);
}
