import {
  CourseLocation,
  CoursePrice,
  CourseStatus,
  CourseTechStackLevel,
} from "~/types/courses";
import {
  ApplicationStatus,
  EnglishLevel,
  Gender,
  Occupation,
  Rate,
} from "~/types/common";
import { StudentStatus } from "~/types/students";
import { ProjectStatus } from "~/types/project";
import { TaskSolutionType } from "~/types/tasks";

export interface KnowledgeSourceCategoryTypes {
  BOOKS: string;
  ARTICLES: string;
  VIDEO: string;
}

export interface KnowledgeSourceStatusTypes {
  RECOMMENDED: string;
  REQUIRED: string;
}

export interface RoleTypes {
  ROLE_ADMIN: string;
  ROLE_MENTOR: string;
  ROLE_STUDENT: string;
}

export interface TeamStatusTypes {
  ON_TRACK: string;
  ISSUES: string;
}
export interface RequirementTypes {
  RECOMMENDED: string;
  REQUIRED: string;
}
export interface TechStackLevelTypes {
  ENTRY: string;
  MEDIUM: string;
  ADVANCED: string;
}

export interface Constants {
  screeningStatusTypes: Record<ApplicationStatus, string>;
  courseStatusTypes: Record<CourseStatus, string>;
  englishLevelTypes: Record<EnglishLevel, string>;
  genderTypes: Record<Gender, string>;
  knowledgeResourceFormatTypes: KnowledgeSourceCategoryTypes;
  knowledgeSourceStatusTypes: KnowledgeSourceStatusTypes;
  locationTypes: Record<CourseLocation, string>;
  occupationTypes: Record<Occupation, string>;
  priceTypes: Record<CoursePrice, string>;
  roleTypes: RoleTypes;
  studentStatusTypes: Record<StudentStatus, string>;
  teamStatusTypes: TeamStatusTypes;
  techStackLevelType: Record<CourseTechStackLevel, string>;
  requirementTypes: RequirementTypes;
  techStackLevelTypes: TechStackLevelTypes;
  projectStatusTypes: Record<ProjectStatus, string>;
  rateValueTypes: Rate[];
  solutionStatusTypes: TaskSolutionType[];
}
