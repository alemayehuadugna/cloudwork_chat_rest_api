
type NotificationType = {
	id: string;
	userId: string;
	title: string;
	message: string;
	isRead: boolean;
	sentAt: Date;
}

class Notification {
	private _id: string;
	private _userId: string;
	private _title: string;
	private _message: string;
	private _isRead: boolean;
	private _sentAt: Date;

	constructor(payload: NotificationType) {
		this._id = payload.id;
		this._userId = payload.userId;
		this._title = payload.title;
		this._message = payload.message;
		this._isRead = payload.isRead;
		this._sentAt = payload.sentAt;
	}

	
	public get id() : string {
		return this._id;
	}

	
	public get userId() : string {
		return this._userId;
	}

	
	public get title() : string {
		return this._title;
	}

	
	public get message() : string {
		return this._message;
	}

	
	public get isRead() : boolean {
		return this._isRead;
	}

	
	public get sentAt() : Date {
		return this._sentAt;
	}
		
}

export { Notification };
export type { NotificationType };