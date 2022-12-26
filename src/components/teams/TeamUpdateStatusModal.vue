<template>
  <c-modal-menu
    v-model:visible="isModalActive"
    title="Update Status"
    ok-text="Send"
    @ok="onSubmit"
  >
    <h3 class="mb-[30px] text-center text-xl font-light text-violet">
      Updating status of the {{ team.name }} team
    </h3>

    <a-form>
      <a-row :gutter="[0, 30]">
        <a-col :span="24" :offset="6">
          <a-form-item label="Status">
            <a-radio-group
              v-model:value="formModel.teamStatus"
              name="teamStatus"
            >
              <a-radio :value="TeamStatus.Issues">
                <c-status color="yellow"> Issues </c-status>
              </a-radio>
              <a-radio :value="TeamStatus.OnTrack">
                <c-status color="green">On track</c-status>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item v-bind="validateInfos.statusComment">
            <a-textarea
              v-model:value="formModel.statusComment"
              placeholder="Enter comment"
              :auto-size="{ minRows: 7, maxRows: 7 }"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import { PropType } from "vue";
import { Form } from "ant-design-vue";
import CModalMenu from "~/components/ui/CModalMenu.vue";
import CStatus from "~/components/ui/CStatus.vue";
import { reactive, useVModel, watch } from "#imports";
import {
  Team,
  TeamResponse,
  TeamStatus,
  TeamUpdateStatusDto,
} from "~/types/teams";
import { useTeamsStore } from "~/store/teams/useTeamsStore";

const props = defineProps({
  team: {
    type: Object as PropType<Team | TeamResponse>,
    required: true,
  },
  visible: {
    type: Boolean,
    default: false,
  },
});
const emit = defineEmits<{
  (e: "update:visible", flag: boolean);
  (e: "updated");
}>();
const isModalActive = useVModel(props, "visible", emit);

const formModel = reactive<TeamUpdateStatusDto>({
  teamStatus: props.team.teamStatus,
  statusComment: "",
});
const formModelRules = reactive({
  statusComment: [
    {
      required: true,
      message: "This is field is required",
    },
  ],
});
const { validateInfos, validate, resetFields } = Form.useForm(
  formModel,
  formModelRules
);

const { updateTeamStatus } = useTeamsStore();

const onSubmit = async () => {
  if (!(await validate())) return;

  await updateTeamStatus(props.team.id, formModel);
  isModalActive.value = false;
  emit("updated");
};
watch(isModalActive, (value) => {
  if (!value) return;

  resetFields();
  formModel.teamStatus = props.team.teamStatus;
});
</script>
