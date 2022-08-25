type SessionType = {
	id: string;
	sessions: Array<string>;
	userId: string;
	isConnected: Boolean;
}

class Session {
	private _id: string;
	private _sessions: Array<string>;
	private _userId: string;
	private _isConnected: Boolean;

	constructor(params: SessionType) {
		this._id = params.id;
		this._isConnected = params.isConnected;
		this._sessions = params.sessions;
		this._userId = params.userId;
	}

	public get sessions() { return this._sessions; }
	public get userId() { return this._userId; }
	public get isConnected() { return this._isConnected; }
	public get id() { return  this._id; }

	public addNewSession(sessionId: string): void {
		this._sessions.push(sessionId);
	}

	public set isConnected(value: Boolean) {
		this._isConnected = value;
	}
}

export { Session };
export type { SessionType };