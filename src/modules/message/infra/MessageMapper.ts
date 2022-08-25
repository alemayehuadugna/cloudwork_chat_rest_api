import { ObjectId } from "mongodb";
import { from } from "uuid-mongodb";
import { Message } from "../domain/Message";
import { MessageSchema } from "./MessageCollection";

const MessageMapper = {
	toOrmEntity: (domainEntity: Message): MessageSchema => ({
		_id: new ObjectId(domainEntity.messageId),
		conversationId: new ObjectId(domainEntity.conversationId),
		senderId: from(domainEntity.senderId),
		content: domainEntity.content,
		sent: domainEntity.sent,
		seen: domainEntity.seen,
		sentAt: domainEntity.sentAt,
		updatedAt: domainEntity.updatedAt,
	}),
	toOrmEntities(domainEntities: Message[]) {
		return domainEntities.map(e => this.toOrmEntity(e));
	},
	toDomainEntity: (ormEntity: MessageSchema): Message => (
		new Message({
			messageId: ormEntity._id.toString(),
			conversationId: ormEntity.conversationId.toString(),
			senderId: from(ormEntity.senderId).toString(),
			content: ormEntity.content,
			sent: ormEntity.sent,
			seen: ormEntity.seen,
			sentAt: ormEntity.sentAt,
			updatedAt: ormEntity.updatedAt,
		})
	),
	toDomainEntities(ormEntities: any[]) {
		return ormEntities.map(e => this.toDomainEntity(e));
	}
}

export { MessageMapper };