import { defineStore } from "pinia";
import { notification } from "ant-design-vue";
import { useFilters } from "#imports";
import StudentsService from "~/services/students";
import {
  Student,
  StudentApplicationAcceptPayload,
  StudentApplicationRejectPayload,
  StudentApplicationScreeningPayload,
  StudentsFilters,
  StudentStatus,
} from "~/types/students";
import { useStudentStore } from "~/store/students/useStudentStore";

export const useStudentsStore = defineStore("Students", () => {
  const {
    filteredItems: students,
    filters: studentsFilters,
    loading: isFetchingStudents,
    totalFilteredItems: totalStudents,
    fetchFilteredItems: fetchStudents,
  } = useFilters<Student, StudentsFilters>(StudentsService, {
    page: 0,
    studentStatus: StudentStatus.Applied,
  });

  const studentStore = useStudentStore();

  const applicationAcceptStudent = async (
    id: string,
    payload: StudentApplicationAcceptPayload
  ) => {
    await StudentsService.applicationAccept(id, payload);
    if (id === studentStore.student?.id) studentStore.fetchStudent(id);
  };

  const applicationRejectStudent = async (
    id: string,
    payload: StudentApplicationRejectPayload
  ) => {
    await StudentsService.applicationReject(id, payload);
    if (id === studentStore.student?.id) studentStore.fetchStudent(id);
  };

  const applicationStartScreening = async (
    id: string,
    payload: StudentApplicationScreeningPayload
  ) => {
    await StudentsService.applicationScreening(id, payload);

    notification.success({
      message: "You successfully start screening",
    });

    if (id === studentStore.student?.id) studentStore.fetchStudent(id);
  };

  return {
    students,
    totalStudents,
    studentsFilters,
    isFetchingStudents,
    fetchStudents,
    applicationAcceptStudent,
    applicationRejectStudent,
    applicationStartScreening,
  };
});
