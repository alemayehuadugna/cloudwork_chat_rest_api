import { Collection, Db, ObjectId } from "mongodb";
import { container } from '@/_boot/di';


type SessionSchema = {
	_id: ObjectId;
	userId: string,
	sessions: Array<string>;
	isConnected: Boolean
}

type SessionCollection = Collection<SessionSchema>;

const initSessionCollection = async (): Promise<SessionCollection> => {
	const db: Db = container.get('Db');
	const collection: SessionCollection = db.collection('sessions');	

	return collection;
}

export { initSessionCollection };
export type { SessionCollection, SessionSchema };