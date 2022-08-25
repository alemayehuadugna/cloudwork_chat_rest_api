import { container } from "@/_boot/di";
import { Collection, Db, ObjectId } from "mongodb"
import { MUUID } from "uuid-mongodb";

type ConversationSchema = {
	_id: ObjectId;
	members: Array<{
		userType: string;
		userId: MUUID;
		user?: any;
	}>;
	lastMessage?: any;
}

type ConversationCollection = Collection<ConversationSchema>;

const initConversationCollection = async (): Promise<ConversationCollection> => {
	const db: Db = container.get('Db');
	const collection: ConversationCollection = db.collection('conversations');

	return collection;
}

export { initConversationCollection };
export type { ConversationCollection, ConversationSchema };