import { fail, type Actions } from "@sveltejs/kit";
import Chatbot from "$lib/ChatBot";

export const actions: Actions = {
  default: async ({ request }) => {
    const data = await request.formData();
    try {
      const bot = new Chatbot(String(data.get('token')));
      bot.conversationId = data.get('conversationId')?.toString();
      bot.responseId = data.get('responseId')?.toString();
      bot.choiceId = data.get('choiceId')?.toString();
      const result = await bot.ask(String(data.get('prompt')));
      const  { content, responseId, choices, conversationId } = result;
      return { content: String(content), responseId, conversationId, choiceId: choices[0]?.id };
    }
    catch(e) {
      return fail(500, { error: String(e) });
    }
  }
};