// adapted from https://github.com/AdamSEY/bard-unofficial-api/blob/main/src/ChatBot.js

import random from 'random';

const BASE_URL = 'https://bard.google.com';
const USER_AGENT =
	'Mozilla/5.0 (Windows NT 10.0; WOW64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.114 Safari/537.36';

const BARD_MODEL = 'boq_assistant-bard-web-server_20230419.00_p1';

class Chatbot {
	init: RequestInit;
	_reqid: number;
	conversationId: string;
	responseId: string;
	choiceId: string;
	SNlM0e: Promise<string>;

	/**
	 * A class to interact with Google Bard.
	 * @param {string} sessionId - The __Secure-1PSID cookie.
	 */
	constructor(sessionId: string) {
		this._reqid = random.int(0, 9999);
		this.conversationId = '';
		this.responseId = '';
		this.choiceId = '';

		this.init = {
			headers: {
				Host: 'bard.google.com',
				'X-Same-Domain': '1',
				'User-Agent': USER_AGENT,
				'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
				Origin: BASE_URL,
				Referer: BASE_URL + '/',
				Cookie: '__Secure-1PSID=' + sessionId
			}
		};
		this.SNlM0e = this.__getSnlm0e();
	}

	async __getSnlm0e() {
		const resp = await fetch(BASE_URL, this.init);
		// Find "SNlM0e":"<ID>"
		if (resp.status !== 200) {
			throw new Error('Could not get Google Bard');
		}
		const data = await resp.text();
		const SNlM0e = data.match(/"SNlM0e":"(.*?)"/);
		if (!SNlM0e) {
			throw new Error('Could not parse SNlM0e');
		}
		return SNlM0e[1];
	}

	async ask(message: string) {
		/**
		 * Send a message to Google Bard and return the response.
		 * @param {string} message - The message to send to Google Bard.
		 * @returns {Object} A dict containing the response from Google Bard.
		 */
		// url params
		const params = new URLSearchParams({
			bl: BARD_MODEL,
			_reqid: String(this._reqid),
			rt: 'c'
		});

		// message arr -> data["f.req"]. Message is double json stringified
		const messageStruct = [[message], null, [this.conversationId, this.responseId, this.choiceId]];
		const SNlM0e = await this.__getSnlm0e();
		const data = {
			'f.req': JSON.stringify([null, JSON.stringify(messageStruct)]),
			at: SNlM0e
		};

		// do the request!
		const resp = await fetch(
			`${BASE_URL}/_/BardChatUi/data/assistant.lamda.BardFrontendService/StreamGenerate?${params}`,
			{
				...this.init,
				method: 'POST',
				body: new URLSearchParams(data).toString()
			}
		);

		const toParse = await resp.text();
		const chatData = JSON.parse(toParse.split('\n')[3])[0][2];
		const jsonChatData = JSON.parse(chatData);

		const results = {
			content: jsonChatData[0][0],
			conversationId: jsonChatData[1][0],
			responseId: jsonChatData[1][1],
			factualityQueries: jsonChatData[3],
			textQuery: jsonChatData[2][0] || '',
			choices: jsonChatData[4].map(([id, content]: unknown[]) => ({ id, content }))
		};
		this.conversationId = results.conversationId;
		this.responseId = results.responseId;
		this.choiceId = results.choices[0]?.id || "";
		this._reqid += 100000;
		return results;
	}
}
export default Chatbot;
