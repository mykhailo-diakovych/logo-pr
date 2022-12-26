import Api from "~/services/Api";

class AdminReviewsService extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  create(studentId: string) {
    return this.post(studentId);
  }

  getAllStudentReviews(studentId: string) {
    return this.get(`student/${studentId}`);
  }

  getAllStudentOwnReviews(studentId: string) {
    return this.get(`student/${studentId}/own`);
  }

  getAllMentorReviews(mentorId: string) {
    return this.get(`mentor/${mentorId}`);
  }
}

export default new AdminReviewsService("reviews");
