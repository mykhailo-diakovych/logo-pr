import CrudService from "~/services/crud";
import {
  Course,
  CourseDetails,
  CourseFilters,
  CoursePayload,
} from "~/types/courses";

class CoursesService extends CrudService<Course, CourseFilters, CoursePayload> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  updateStatus(id: string, payload: any) {
    return this.put(`${id}/status`, { body: payload });
  }

  async getDetails(courseId: string) {
    const { data } = await this.get<CourseDetails>(`${courseId}/details`);
    return data;
  }
}

export default new CoursesService("courses");
