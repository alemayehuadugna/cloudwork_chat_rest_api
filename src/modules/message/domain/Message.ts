type MessageType = {
	messageId: string | null;
	conversationId: string;
	senderId: string;
	content: any;
	sent: boolean;
	seen: boolean;
	sentAt: Date;
	updatedAt: Date;
}

class Message {
	private _messageId: string | null;
	private _conversationId: string;
	private _senderId: string;
	private _content: any;
	private _sent: boolean;
	private _seen: boolean;
	private _sentAt: Date;
	private _updatedAt: Date;

	constructor(params: MessageType) {
		this._messageId = params.messageId;
		this._conversationId = params.conversationId;
		this._senderId = params.senderId;
		this._content = params.content;
		this._sent = params.sent;
		this._seen = params.seen;
		this._sentAt = params.sentAt;
		this._updatedAt = params.updatedAt;
	}

	public get messageId(): any {
		return this._messageId;
	}

	public get conversationId(): string {
		return this._conversationId;
	}

	public get senderId(): string {
		return this._senderId;
	}

	public get content() {
		return this._content;
	}

	public get sent() {
		return this._sent;
	}

	public get seen() {
		return this._seen;
	}

	public get sentAt() {
		return this._sentAt;
	}

	public get updatedAt() {
		return this._updatedAt;
	}
}

export { Message };
export type { MessageType };