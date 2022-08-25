import { Message } from "@/modules/message/domain/Message";

type MemberType = {
	userType: string;
	userId: string;
	user?: any;
}

type ConversationType = {
	id: string;
	members: Array<MemberType>;
	lastMessage?: Message;
}

class Conversation {
	private _id: string;
	private _members: Array<MemberType>;
	private _lastMessage?: Message;

	constructor(payload: ConversationType) {
		this._id = payload.id;
		this._members = payload.members;
		this._lastMessage = payload.lastMessage;
	}

	public get id() {
		return this._id;
	}

	public get members() {
		return this._members;
	}

	public get lastMessage() {
		return this._lastMessage;
	}
}

export { Conversation };
export type { ConversationType };