<template>
  <a-table
    v-if="(option?.data && option?.columns) || (columns && items)"
    v-model:expanded-row-keys="expandedRowKeys"
    :columns="tableColumns"
    :data-source="option?.data || items"
    :pagination="paginationOptions"
    class="c-table"
    :row-key="rowKey"
    @change="onChange"
  >
    <template v-if="useExpandedRow" #expandedRowRender></template>
    <template #headerCell="{ column, record }">
      <a-checkbox
        v-if="'RC_TABLE_INTERNAL_COL_DEFINE' in column"
        v-model:checked="isExpandedAll"
      />
      <slot name="headerCell" :column="column" :record="record" />
    </template>
    <template #bodyCell="{ text, record, column }">
      <slot name="bodyCell" :column="column" :record="record" />
      <template v-if="isExpandableField(column.dataIndex)">
        <div
          class="c-table__column"
          :class="[
            `c-table__column--${column.key}`,
            { expand: expandedRowKeys.includes(record.id) },
          ]"
          v-html="text"
        ></div>
      </template>

      <template v-if="column.key === 'actions'">
        <a-dropdown overlay-class-name="c-table-action">
          <div class="flex justify-end items-center cursor-pointer">
            <icon
              name="heroicons-outline:dots-horizontal"
              size="24px"
              class="hover:text-peach"
            />
          </div>

          <template #overlay>
            <slot name="column-action" :item="record">
              <a-menu v-if="actions.length">
                <a-menu-item
                  v-for="(action, index) in actions"
                  :key="index"
                  @click="action.handler(record)"
                >
                  <component :is="action.icon" v-if="action.icon" />
                  {{ action.title }}
                </a-menu-item>
              </a-menu>
            </slot>
          </template>
        </a-dropdown>
      </template>
    </template>
  </a-table>
</template>

<script lang="ts" setup>
import { TablePaginationConfig } from "ant-design-vue/es/table/Table";
import { PropType } from "vue";
import { ColumnsType } from "ant-design-vue/es/table";
import { TableProps } from "ant-design-vue";
import { TableActions } from "~/types/table";
import { computed, ref } from "#imports";

const props = defineProps({
  option: {
    type: Object,
    default: () => null,
  },
  items: {
    type: Array as PropType<any[]>,
    default: () => [],
  },
  columns: {
    type: Array as PropType<ColumnsType>,
    default: () => [],
  },
  pageSize: {
    type: Number,
    default: 10,
  },
  current: {
    type: Number,
    default: 1,
  },
  total: {
    type: Number,
    default: 0,
  },
  useExpandedRow: {
    type: Boolean,
    default: false,
  },
  fieldToExpanded: {
    type: [String, Array],
    default: "description",
  },
  actions: {
    type: Array as PropType<TableActions<unknown>>,
    default: () => [],
  },
  sort: {
    type: String,
    default: "",
  },
  rowKey: {
    type: String,
    default: "id",
  },
});

const isExpandedAll = ref(false);
watch([isExpandedAll, () => props.items], ([expanded]) => {
  expandedRowKeys.value = expanded
    ? props.items?.map((item) => item[props.rowKey])
    : [];
});

const addCenterClassName = (columns: ColumnsType) =>
  columns
    ? columns.map((item) =>
        item.key === "actions" ? { ...item, className: "center" } : { ...item }
      )
    : [];

const tableColumns = computed(() =>
  props.option?.columns
    ? addCenterClassName(props.option?.columns)
    : addCenterClassName(props.columns)
);

const expandedRowKeys = ref<string[]>([]);

const isExpandableField = (field: string) => {
  if (Array.isArray(props.fieldToExpanded))
    return props.fieldToExpanded.includes(field);

  return field === props.fieldToExpanded;
};

const emit = defineEmits<{
  (e: "update:current", page: number): void;
  (e: "update:sort", field: string | null): void;
}>();

const paginationOptions = computed<TablePaginationConfig>(() => ({
  total: props.total,
  current: props.current + 1,
  pageSize: props.pageSize,
  "onUpdate:current": (current: number) => emit("update:current", current - 1),
}));

const onChange: TableProps["onChange"] = (_, __, sorter) => {
  if (Array.isArray(sorter)) return;
  emit(
    "update:sort",
    sorter.order
      ? [sorter.field, sorter.order.replace("end", "")].join(",")
      : null
  );
};
</script>

<style lang="scss">
.c-table {
  .ant-pagination {
    justify-content: center;

    &-item {
      @apply flex items-center justify-center;

      a {
        @apply text-sm leading-[22px] text-violet;
      }

      &-active {
        @apply border-blue;

        a {
          @apply text-blue;
        }
      }
    }

    &-prev,
    &-next {
      button {
        @apply flex items-center justify-center text-violet hover:text-violet;
      }
    }

    &-disabled button {
      @apply bg-alabaster;
    }
  }

  .ant-table {
    table {
      @apply rounded-none;
    }

    &-thead {
      tr {
        th {
          @apply bg-alabaster before:hidden px-4 py-3.5 text-sm leading-4 text-bombay border-0 font-normal;
        }

        &:first-child {
          th {
            &:first-child {
              @apply rounded-l-[6px];
            }

            &:last-child {
              @apply rounded-r-[6px];
            }
          }
        }
      }
    }

    &-tbody {
      .ant-table-measure-row td {
        @apply p-0;
      }

      tr:not(.ant-table-measure-row) {
        td {
          @apply border-t border-alabaster px-4 py-[22px] text-sm leading-4 text-violet;

          &:first-child {
            @apply border-l rounded-l-[6px];
          }

          &:last-child {
            @apply border-r rounded-r-[6px];
          }
        }

        &:last-child td {
          @apply border-b border-alabaster;
        }
      }

      //& > tr.ant-table-row:hover > td,
      & > tr > td.ant-table-cell-row-hover {
        @apply bg-white;
      }

      & > tr.ant-table-row > td {
        @apply bg-transparent transition-none;
      }

      & > tr.ant-table-row:hover > td {
        @apply bg-transparent;
      }
    }
  }

  .action-btn:hover {
    div {
      @apply bg-peach;
    }
  }

  .ant-table-expanded-row {
    display: none;
  }
  .ant-table-row {
    vertical-align: top;
  }
  .ant-table-row-expand-icon {
    transform: scale(1.2);
  }

  &__column {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    height: auto;
    max-height: 32px;
    &.expand {
      height: auto;
      max-height: inherit;
      line-clamp: 1000;
      -webkit-line-clamp: 1000;
    }
  }
  &-action {
    .ant-dropdown {
      &-menu {
        &-title-content {
          @apply text-bombay transition-all duration-500;

          span {
            @apply text-bombay transition-all duration-500;
          }
        }

        &-item {
          &-selected {
            @apply bg-white;
          }

          &:hover {
            @apply bg-white;

            .ant-dropdown-menu-title-content {
              @apply text-peach;

              span {
                @apply text-peach;
              }
            }
          }
        }
      }
    }
  }

  .center {
    @apply relative;

    & > div {
      @apply absolute h-full w-full left-0 top-0 px-4;
    }
  }
}
</style>
