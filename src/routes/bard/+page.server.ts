import { fail, type Actions } from "@sveltejs/kit";
import Chatbot from "$lib/ChatBot";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    try {
      const bot = new Chatbot(String(data.get('token')));
      const { content } = await bot.ask(String(data.get('prompt')));
      return { content: String(content) };
    }
    catch(e) {
      return fail(500, { error: String(e) });
    }
  }
};