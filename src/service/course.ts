import * as accountApi from '../api/accounts';
import * as userApi from '../api/users';
import * as coursesApi from '../api/courses';
import {logger} from '../helpers/log';

import {Authorization} from "./auth";
import {AttendanceItem, getAllCourse, getAttendance} from "../api/courses";

export async function getUnCompletedCourseComponents(me: Authorization, ignoreCourseIds?: number[]) {
  const terms = await accountApi.terms(me.user_id, me.token);
  const defaultTerm = terms.enrollment_terms.find(term => term.default) || terms.enrollment_terms[terms.enrollment_terms.length - 1];
  const learnstatuses = await userApi.learnActivities({
    userId: me.user_login,
    token: me.token,
    term_id: defaultTerm.id,
  });

  const now = new Date();

  const onlineCourses = learnstatuses
  .filter(({course_format, id}) => course_format !== 'none' && !ignoreCourseIds?.includes(id))

  const components = (await Promise.all(
    onlineCourses.map(async course => {
      const courseComponents = await coursesApi.getAllCourse({token: me.token, coursesId: course.id});
      return courseComponents.filter(({module_items}) => module_items.length > 0)
      .map((value) => {
        return value.module_items
        .filter(({content_data}) => content_data?.use_attendance)
        .map((module_items) => ({
          ...module_items,
          name: course.name,
          professors: course.professors,
        })).concat()
      })
      .filter((value) => value.length > 0)
    })
  ));

  const result = components.flat().flat()

  const resultWithAttendance = (await Promise.all(
    result.map(async data => {
      const attendanceResponse = await getAttendance({
        token: me.token,
        courseId: data.content_data!.course_id,
        itemId: data.content_data!.item_id
      })

      return {
        ...data,
        ...attendanceResponse,
      } as AttendanceItem
    })
  ))

  const activeComponents = resultWithAttendance.filter(({content_data}) => {
    return content_data && new Date(content_data.unlock_at) < now && (content_data.due_at === null || now < new Date(content_data.due_at));
  });

  return activeComponents.filter(({ attendance_data }) => attendance_data.attendance_status === 'none');
}
