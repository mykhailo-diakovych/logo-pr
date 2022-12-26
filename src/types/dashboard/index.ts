export interface CourseStatistics {
  COMPLETED: number;
  ACTIVE: number;
  SCHEDULED: number;
}

export interface StudentStatistics {
  APPLIED: number;
  GRADUATED: number;
  ACTIVE: number;
  REJECTED: number;
}

export interface UserStatistics {
  ROLE_MENTOR: number;
  ROLE_ADMIN: number;
}

export interface TeamStatistics {
  ISSUES: number;
  ON_TRACK: number;
}

export interface KnowledgeResourceStatistics {
  VIDEO: number;
  ARTICLES: number;
  BOOKS: number;
}

export interface ProjectStatistics {
  DRAFT: number;
  COMPLETED: number;
  IN_PROGRESS: number;
  PLANNED: number;
}

export interface AcademyTaskStatistics {
  ONBOARDING: number;
  APPLICATION: number;
  FINAL: number;
  ACTIVE: number;
}

export interface AdminDashboard {
  courseStatistics: CourseStatistics;
  studentStatistics: StudentStatistics;
  userStatistics: UserStatistics;
  teamStatistics: TeamStatistics;
  knowledgeResourceStatistics: KnowledgeResourceStatistics;
  projectStatistics: ProjectStatistics;
  academyTaskStatistics: AcademyTaskStatistics;
}

export interface AcademyTask {
  total: number;
  approved: number;
}

export interface MentorDashboardWeeklyUpdates {
  id: string;
  updatingUntil: string;
}

export interface StudentSummary {
  id: string;
  firstName: string;
  lastName: string;
  weeklyUpdates: MentorDashboardWeeklyUpdates[];
  academyTask: AcademyTask;
}

export interface MentorDashboard {
  studentSummaries: StudentSummary[];
}
