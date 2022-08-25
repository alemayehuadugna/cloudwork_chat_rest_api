import { Failure } from '@/_boot/error/failure';
import { inject, injectable } from 'inversify';
import { Either, Left, Right } from 'monet';
import { Message } from "../domain/Message";
import { MessageRepository } from "../domain/MessageRepository";
import { MessageCollection, MessageSchema } from "./MessageCollection";
import { MessageMapper } from './MessageMapper';
import { DatabaseFailure } from '../../../_boot/error/failure';
import { Filter, ObjectId } from 'mongodb';

@injectable()
class MessageRepositoryImpl implements MessageRepository {
	constructor(
		@inject('MessageCollection') private messageCollection: MessageCollection
	) { }

	async store(message: Message): Promise<Either<Failure, void>> {
		try {
			const ormMessage = MessageMapper.toOrmEntity(message);
			const count = await this.messageCollection.countDocuments({ _id: message.messageId });

			if (count) {
				await this.messageCollection.updateOne(
					{ _id: ormMessage._id },
					{
						$set: {
							...ormMessage
						}
					}
				)
				return Right(undefined);
			}

			await this.messageCollection.insertOne(ormMessage);
			return Right(undefined);
		} catch (error) {
			return Left(new DatabaseFailure("Error Saving Message"));
		}

	}
	async findById(messageId: string): Promise<Either<Failure, Message>> {
		const message = await this.messageCollection.findOne({ _id: new ObjectId(messageId) });

		if (!message) {
			return Left(new DatabaseFailure("Message not found"))
		}

		return Right(MessageMapper.toDomainEntity(message));
	}
	async find(conversationId: string, pagination: any, filter: any): Promise<Either<Failure, Message[]>> {
		let match: Filter<MessageSchema> = {
			conversationId: new ObjectId(conversationId)
		}

		try {
			const messages = await this.messageCollection.aggregate([
				{
					$match: match,
				},
				{ $sort: { sentAt: -1 } },
			]).toArray();

			return Right(MessageMapper.toDomainEntities(messages));
		} catch (error) {
			return Left(new DatabaseFailure("Error Loading Messages"));
		}
	}
}

export { MessageRepositoryImpl }