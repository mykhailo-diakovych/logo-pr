import Api from "~/services/Api";
import { Feedback, MentorFeedback } from "~/types/feedbacks";

class Feedbacks extends Api {
  constructor(baseUrl: string) {
    super(baseUrl);
  }

  async getByStudentId(id: string) {
    const { data } = await this.get<Feedback>(id);
    return data;
  }

  async update(id: string, content: string) {
    const { data } = await this.put(id, { content });
    return data;
  }

  async createDraft(id: string, content: string) {
    const { data } = await this.post(id, { content });
    return data;
  }

  async submit(id: string) {
    const { data } = await this.put(`${id}/submit`);
    return data;
  }

  async getByMentorId(id: string) {
    const { data } = await this.get<MentorFeedback[]>(`mentor/${id}`);
    return data;
  }
}

export default new Feedbacks("feedbacks");
