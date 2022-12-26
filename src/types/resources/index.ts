import { LogoFile, Occupation } from "~/types/common";
import { FilterSort, Pagination } from "~/types/filters";

export interface Resource {
  id: string;
  title: string;
  sourceLink: string;
  description: string;
  occupation: Occupation;
  requirement: ResourceType;
  knowledgeResourceFormat: ResourceFormat;
  resourceAttachment: LogoFile;
  createdAt: string;
}

export interface ResourcePayload {
  knowledgeResourceRequest: Omit<
    Resource,
    "id" | "createdAt" | "resourceAttachment"
  >;
  file: File;
}

export interface ResourceFilters extends Pagination, FilterSort {
  occupations?: string[];
  resourceFormats?: string[];
  title?: string;
}

export enum ResourceFormat {
  Book = "BOOKS",
  Video = "VIDEO",
  Article = "ARTICLES",
}

export enum ResourceType {
  Recommended = "RECOMMENDED",
  Required = "REQUIRED",
}
