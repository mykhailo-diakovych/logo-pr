export interface SidebarItem<T> {
  title: string;
  icon: T;
  link: string;
  only_admin?: boolean;
}
