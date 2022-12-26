<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    :body-style="{ maxHeight: 'calc(100vh - 200px)', overflow: 'auto' }"
    :title="title"
    :ok-text="submitCaption"
    :confirm-loading="isLoading"
    @ok="onSubmit"
  >
    <a-form layout="vertical">
      <a-row :gutter="[0, 30]">
        <a-col :span="24">
          <a-form-item label="Team name" v-bind="validateInfos.name">
            <a-input
              v-model:value="formModel.name"
              bordered
              placeholder="Enter Team name"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <h3 class="text-xl text-violet">Add Student</h3>
          <team-students-list
            v-model:students="formModel.students"
            class="mb-2.5"
          />
          <a-select
            v-model:value="selectedStudent"
            class="w-full"
            show-search
            :filter-option="true"
            option-filter-prop="label"
            option-label-prop="label"
            :options="studentsAutocompleteOptions"
            placeholder="Search student"
            @select="onSelectStudent"
          />
          <!--          <a-auto-complete-->
          <!--            v-model:value="selectedStudent"-->
          <!--            class="w-full"-->
          <!--            :filter-option="filterHandler"-->
          <!--            placeholder="Search student"-->
          <!--            :options="studentsAutocompleteOptions"-->
          <!--            @select="onSelectStudent"-->
          <!--          />-->
        </a-col>
        <a-col :span="24">
          <h3 class="text-xl text-violet">Project Info</h3>

          <a-row :gutter="20">
            <a-col :span="12">
              <a-form-item label="Project" v-bind="validateInfos.projectId">
                <a-select
                  v-model:value="formModel.projectId"
                  :options="projectsSelectOptions"
                  show-search
                  :filter-option="true"
                  option-filter-prop="label"
                  placeholder="Select project"
                />
              </a-form-item>
            </a-col>
            <a-col :span="12">
              <a-form-item label="Manager" v-bind="validateInfos.managerId">
                <a-select
                  v-model:value="formModel.managerId"
                  :options="managersSelectOptions"
                  show-search
                  :filter-option="true"
                  option-filter-prop="label"
                  placeholder="Select manager"
                />
              </a-form-item>
            </a-col>
          </a-row>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script setup lang="ts">
import { Form } from "ant-design-vue";
import { Rule } from "ant-design-vue/es/form";
import CModalMenu from "~/components/ui/CModalMenu";
import { computed, reactive, ref, useToggle, useVModel, watch } from "#imports";
import { Student } from "~/types/students";
import TeamStudentsList from "~/components/teams/TeamStudentsList.vue";
import { useTeamsStore } from "~/store/teams/useTeamsStore";
import { CreateTeamDto } from "~/types/teams";
import Teams from "~/services/teams";
import { useFetchManagers } from "~/composables/managers/useFetchManagers";
import { useFetchAppliedStudents } from "~/composables/students/useFetchNewStudents";
import { useFetchListProjects } from "~/composables/projects/useFetchListProjects";

const props = defineProps({
  selectedTeamId: {
    type: String,
    default: "",
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean): void;
  (e: "update:selected-task-id", flag: boolean): void;
}>();
const isModalActive = useVModel(props, "visible", emit);
const selectedTeamId = useVModel(props, "selectedTeamId", emit);
const isEditable = computed(() => !!props.selectedTeamId);
const title = computed(() =>
  isEditable.value ? "Update Team" : "Create Team"
);
const submitCaption = computed(() => (isEditable.value ? "Save" : "Create"));

const { newStudents, fetchAppliedStudents } = useFetchAppliedStudents();

const selectedStudent = ref(null);
const computedStudents = computed(() =>
  newStudents.value.filter(
    (student) =>
      !formModel.students.find((existStudent) => existStudent.id === student.id)
  )
);
const studentsAutocompleteOptions = computed(() =>
  computedStudents.value.map((student) => ({
    label: `${student.firstName} ${student.lastName}`,
    value: student.id,
  }))
);
const onSelectStudent = (studentId: string) => {
  formModel.students.push(
    computedStudents.value.find((student) => student.id === studentId)!
  );
  selectedStudent.value = null;
};

interface FormModel {
  students: Student[];
  managerId: string;
  projectId: string;
  name: string;
}

const formModel = reactive<FormModel>({
  students: [],
  managerId: "",
  projectId: "",
  name: "",
});
const formModelRules = reactive<Partial<Record<keyof FormModel, Rule[]>>>({
  name: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  managerId: [
    {
      required: true,
      message: "This field is required",
    },
  ],
  projectId: [
    {
      required: true,
      message: "This field is required",
    },
  ],
});
const { resetFields, validate, validateInfos } = Form.useForm(
  formModel,
  formModelRules
);

const { createTeam, updateTeam } = useTeamsStore();
const { managersSelectOptions, fetchManagers } = useFetchManagers();
const { projectsSelectOptions, fetchNewProjects } = useFetchListProjects();

const [isLoading, toggleLoading] = useToggle();

const onSubmit = async () => {
  if (!(await validate())) return;

  const payload: CreateTeamDto = {
    ...formModel,
    studentIds: formModel.students.map((student) => student.id),
  };
  toggleLoading(true);
  try {
    isEditable.value
      ? await updateTeam(selectedTeamId.value, payload)
      : await createTeam(payload);

    isModalActive.value = false;
  } finally {
    toggleLoading(false);
  }
};
watch(isModalActive, (active) => {
  if (!active) {
    selectedTeamId.value = "";
    return;
  }
  resetFields();
  fetchManagers();
  fetchNewProjects();
  fetchAppliedStudents();
});
watch([isModalActive, selectedTeamId], async ([active, teamId]) => {
  if (!active || !teamId) return;

  const team = await Teams.getDetails(teamId);

  Object.keys(formModel).forEach((key) => {
    formModel[key] = team[key];
  });
});
</script>
