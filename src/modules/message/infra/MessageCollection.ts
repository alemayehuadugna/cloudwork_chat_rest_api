import { container } from '@/_boot/di';
import { ObjectId, Collection, Db } from 'mongodb';
import { MUUID } from "uuid-mongodb";

type MessageSchema = {
	_id: ObjectId;
	conversationId: ObjectId;
	senderId: MUUID;
	content: any;
	sent: boolean;
	seen: boolean;
	sentAt: Date;
	updatedAt: Date;
}

type MessageCollection = Collection<MessageSchema>;

const initMessageCollection = async (): Promise<MessageCollection> => {
	const db: Db = container.get('Db');
	const collection: MessageCollection = db.collection('messages');

	await collection.createIndex({ sentAt: -1 });

	return collection;
}

export { initMessageCollection };
export type { MessageCollection, MessageSchema };