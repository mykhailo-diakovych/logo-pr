<template>
  <a-modal
    centered
    :ok-text="okText"
    :cancel-text="cancelText"
    :wrap-class-name="`c-modal-menu ${className}`"
    :width="width"
    class="c-modal-menu"
    :confirm-loading="loading"
    :ok-button-props="{ disabled: loading }"
    :class="{
      hideFooter: !footer,
    }"
  >
    <a-spin :spinning="loading">
      <h2
        class="text-center text-2xl leading-7 font-medium text-violet max-w-[430px] mx-auto mb-[30px] capitalize"
        :class="titleClass"
      >
        {{ title }}
      </h2>

      <slot />
    </a-spin>
  </a-modal>
</template>

<script setup lang="ts">
defineProps({
  title: {
    type: String,
    default: "",
  },
  okText: {
    type: String,
    default: "",
  },
  cancelText: {
    type: String,
    default: "Cancel",
  },
  className: {
    type: [String, Boolean],
    default: "",
  },
  titleClass: {
    type: String,
    default: "",
  },
  width: {
    type: String,
    default: "670px",
  },
  loading: {
    type: Boolean,
    default: false,
  },
  footer: {
    type: [Boolean],
    default: true,
  },
});
</script>

<style lang="scss">
.c-modal-menu {
  &.hideFooter {
    .ant-modal-footer {
      @apply hidden;
    }
  }

  .ant {
    &-modal {
      &-content {
        @apply rounded-md py-10;
      }

      &-header {
        @apply hidden;
      }

      &-body {
        @apply px-[47px] py-0;
      }

      &-footer {
        @apply pt-[30px] px-[47px] border-0 flex justify-center gap-x-[30px];

        .ant-btn {
          @apply w-[170px] rounded-md h-[50px] text-base leading-6 font-normal m-0 last-of-type:mx-0;

          & + .ant-btn:not(.ant-dropdown-trigger) {
            @apply mx-0;
          }
        }
      }
    }

    &-form {
      &-item {
        @apply mb-0;

        &-label > label {
          @apply text-base font-normal leading-[22px] text-violet;

          &::before {
            display: none !important;
          }
        }

        .ant-input {
          @apply rounded-md py-2 px-3 placeholder:text-alto text-base font-normal leading-6 text-violet;
        }
      }
    }

    &-picker {
      @apply w-full rounded-md px-3 py-2 h-[40px];

      input::placeholder {
        @apply text-base self-end font-normal text-alto;
      }
    }

    &-select {
      &-single.ant-select-show-arrow .ant-select-selection {
        &-item,
        &-placeholder {
          @apply text-base leading-6 font-normal text-alto;
        }

        &-item {
          @apply text-violet;
        }
      }

      &:not(.ant-select-customize-input):not(.ant-select-auto-complete) {
        .ant-select-selector {
          @apply rounded-md pt-2 pb-0 px-3 h-[40px];

          input {
            @apply h-full;
          }
        }
      }
      &-auto-complete .ant-select-selector {
        @apply rounded-md pt-[0.28rem] h-[40px];

        .ant-select-selection-search {
          @apply pt-[0.28rem];
        }
        input {
          @apply h-full pt-[0.28rem];
        }
      }
    }
  }

  &.remove .ant-modal-content {
    @apply pt-[100px] pb-[80px];
  }

  &.change-password .ant-modal-body {
    @apply w-[464px];
  }
}
</style>
