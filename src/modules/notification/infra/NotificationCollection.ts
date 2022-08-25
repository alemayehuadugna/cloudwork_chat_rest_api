import { container } from "@/_boot/di";
import { ObjectId, Db, Collection } from 'mongodb';
import { MUUID } from "uuid-mongodb";

type NotificationSchema = {
	_id: ObjectId;
	userId: MUUID;
	title: string;
	message: string;
	isRead: boolean;
	sentAt: Date;
}

type NotificationCollection = Collection<NotificationSchema>;

const initNotificationCollection = async (): Promise<NotificationCollection> => {
	const db: Db = container.get('Db');
	const collection: NotificationCollection = db.collection('notifications');
	return collection;
}

export { initNotificationCollection };
export type { NotificationCollection, NotificationSchema };