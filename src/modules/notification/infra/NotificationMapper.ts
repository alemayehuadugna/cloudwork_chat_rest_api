import { ObjectId } from "mongodb";
import { from } from "uuid-mongodb";
import { Notification } from "../domain/Notification";
import { NotificationSchema } from "./NotificationCollection";

const NotificationMapper = {
	toOrmEntity: (domainEntity: Notification): NotificationSchema => ({
		_id: new ObjectId(domainEntity.id),
		userId: from(domainEntity.userId),
		title: domainEntity.title,
		message: domainEntity.message,
		isRead: domainEntity.isRead,
		sentAt: domainEntity.sentAt
	}),
	toDomainEntity: function (ormEntity: NotificationSchema): Notification {
		return (new Notification({
			id: ormEntity._id.toString(),
			userId: from(ormEntity.userId).toString(),
			title: ormEntity.title,
			message: ormEntity.message,
			isRead: ormEntity.isRead,
			sentAt: ormEntity.sentAt
		},))
	},
	toDomainEntities(ormEntities: any[]) {
		return ormEntities.map(e => this.toDomainEntity(e));
	}
}

export { NotificationMapper }