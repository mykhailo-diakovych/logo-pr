import CrudService from "~/services/crud";
import {
  Student,
  StudentApplicationAcceptPayload,
  StudentApplicationRejectPayload,
  StudentApplicationScreeningPayload,
  StudentsFilters,
  StudentStatus,
  StudentUpdatePayload,
} from "~/types/students";

// TODO: Remove create method for this service
class StudentsService extends CrudService<
  Student,
  StudentsFilters,
  undefined,
  StudentUpdatePayload
> {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getNew() {
    const { data } = await this.get<Student[]>("new");
    return data;
  }

  async updateStatus(id: string, studentStatus: StudentStatus) {
    const { data } = await this.put(`${id}/status`, { studentStatus });
    return data;
  }

  async applicationReject(
    id: string,
    payload: StudentApplicationRejectPayload
  ) {
    const { data } = await this.post(`${id}/application/reject`, payload);
    return data;
  }

  async applicationAccept(
    id: string,
    payload: StudentApplicationAcceptPayload
  ) {
    const { data } = await this.post(`${id}/application/accept`, payload);
    return data;
  }

  async applicationScreening(
    id: string,
    payload: StudentApplicationScreeningPayload
  ) {
    const { data } = await this.post(`${id}/application/screening`, payload);
    return data;
  }

  async studentSuspend(id: string) {
    const { data } = await this.put(`${id}/suspend`);
    return data;
  }
}

export default new StudentsService("students");
