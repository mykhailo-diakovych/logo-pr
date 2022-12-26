import { ComponentInstance } from "@vue/devtools-api";

export interface TableAction<T> {
  title: string;
  icon: ComponentInstance;
  handler: (data: T) => void;
}
export type TableActions<T> = TableAction<T>[];
