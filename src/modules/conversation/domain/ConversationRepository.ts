import { Conversation } from "./Conversation";
import { Failure } from '@/_boot/error/failure';
import { Either } from "monet";

interface ConversationRepository {
	store(conversation: Conversation): Promise<Either<Failure, Conversation>>;
	findById(conversationId: string): Promise<Either<Failure, Conversation>>;
	find(userId: string, userType: string): Promise<Either<Failure, Conversation[]>>;
	delete(conversationId: string): Promise<Either<Failure, void>>;
}

export { ConversationRepository };