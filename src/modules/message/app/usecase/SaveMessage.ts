import { inject, injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { ObjectId } from "mongodb";
import { Failure } from '../../../../_boot/error/failure';
import { Message } from "../../domain/Message";
import { MessageRepository } from "../../domain/MessageRepository";

type SaveMessageDTO = {
	conversationId: string;
	senderId: string;
	content: any;
	sent: boolean;
	seen: boolean;
	sentAt: Date;
	updatedAt: Date;
}

interface SaveMessageUseCase {
	execute(params: SaveMessageDTO): Promise<Either<Failure, Message>>;
}

@injectable()
class SaveMessageUseCaseImpl implements SaveMessageUseCase {
	constructor(
		@inject("MessageRepository") private messageRepository: MessageRepository
	) { }
	async execute(params: SaveMessageDTO): Promise<Either<Failure, Message>> {
		const newMessage = new Message({
			messageId: new ObjectId().toString(),
			conversationId: params.conversationId,
			senderId: params.senderId,
			content: params.content,
			sent: params.sent,
			seen: params.seen,
			sentAt: params.sentAt,
			updatedAt: params.updatedAt
		});
		const message = await this.messageRepository.store(newMessage);
		return message.fold(
			(error) => {
				return Left(error);
			},
			() => {
				return Right(newMessage);
			}
		)
	}
}

export { SaveMessageUseCase, SaveMessageUseCaseImpl };