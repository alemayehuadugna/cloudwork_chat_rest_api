import { Message } from "@/modules/message/domain/Message";
import { ObjectID } from "bson";
import { from } from "uuid-mongodb";
import { Conversation } from "../domain/Conversation";
import { ConversationSchema } from "./ConversationCollection";

const ConversationMapper = {
	toOrmEntity: (domainEntity: Conversation): ConversationSchema => ({
		_id: new ObjectID(domainEntity.id),
		members: domainEntity.members.map((e) => {
			return {
				userType: e.userType,
				userId: from(e.userId),
			};
		}),
		lastMessage: domainEntity.lastMessage,
	}),
	toOrmEntities(domainEntities: Conversation[]) {
		return domainEntities.map(e => this.toOrmEntity(e));
	},
	toDomainEntity: function (ormEntity: ConversationSchema): Conversation {
		return (
			new Conversation({
				id: ormEntity._id.toString(),
				members: ormEntity.members.map((e) => {
					return {
						userType: e.userType,
						userId: from(e.userId).toString(),
						user: e.user,
					};
				}),
				lastMessage: ormEntity.lastMessage != undefined? new Message(
					{
						messageId: ormEntity.lastMessage._id,
						conversationId: ormEntity.lastMessage.conversationId,
						senderId: ormEntity.lastMessage.senderId,
						content: ormEntity.lastMessage.content,
						sent: ormEntity.lastMessage.sent,
						seen: ormEntity.lastMessage.seen,
						sentAt: ormEntity.lastMessage.sentAt,
						updatedAt: ormEntity.lastMessage.updatedAt
					}
				): undefined,
			}));
	},
	toDomainEntities(ormEntities: any[]) {
		return ormEntities.map(e => this.toDomainEntity(e));
	},
}

export { ConversationMapper };