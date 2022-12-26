export interface Feedback {
  id: string;
  content: string;
  feedbackStatus: string;
  updatedAt: string;
}

export interface MentorFeedback {
  id: string;
  authorFirstName: string;
  authorLastName: string;
  content: string;
  feedbackStatus: string;
  updatedAt: string;
}
