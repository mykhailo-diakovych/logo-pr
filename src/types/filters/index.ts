export interface Pagination {
  page?: number;
  size?: number;
}

export interface FilterSort {
  sort?: string[] | string | null;
}
export interface FilterSearch {
  search?: string;
}
export interface FilterStatus<T = string> {
  status?: T;
}

interface FilterResponsePageable {
  sort: FilterResponseSort;
  offset: number;
  pageNumber: number;
  pageSize: number;
  unpaged: boolean;
  paged: boolean;
}
interface FilterResponseSort {
  empty: boolean;
  unsorted: boolean;
  sorted: boolean;
}
export interface FilterResponse<T> {
  content: T[];
  pageable: FilterResponsePageable;
  totalPages: number;
  totalElements: number;
  last: boolean;
  size: number;
  number: number;
  sort: FilterResponseSort;
  numberOfElements: number;
  first: boolean;
  empty: boolean;
}
