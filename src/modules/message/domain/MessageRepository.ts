import { Either } from "monet";
import { Message } from "./Message";
import { Failure } from '../../../_boot/error/failure';

interface MessageRepository {
	store(message: Message): Promise<Either<Failure, void>>;
	findById(messageId: string): Promise<Either<Failure, Message>>;
	find(conversationId: string, pagination: any, filter: any): Promise<Either<Failure, Message[]>>;
}

export { MessageRepository };