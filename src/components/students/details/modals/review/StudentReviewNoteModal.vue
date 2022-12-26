<template>
  <c-modal-menu
    :body-style="{ maxHeight: 'calc(100vh - 150px)', overflow: 'auto' }"
    title="Note"
    width="580px"
    :footer="null"
  >
    <div v-html="text"></div>
  </c-modal-menu>
</template>

<script lang="ts" setup>
import CModalMenu from "~/components/ui/CModalMenu.vue";

defineProps({
  text: {
    type: String,
    required: true,
  },
});
</script>
