import { ObjectID } from 'bson';
import { id, inject, injectable } from 'inversify';
import { Either, Left, Right } from 'monet';
import { Failure } from '../../../../_boot/error/failure';
import { Conversation } from '../../domain/Conversation';
import { ConversationRepository } from '../../domain/ConversationRepository';

type CreateConversationDTO = {
	members: {
		userType: string;
		userId: string
	}[];
	userId: string;
}

interface CreateConversationUseCase {
	execute(params: CreateConversationDTO): Promise<Either<Failure, Conversation>>;
}

@injectable()
class CreateConversationUseCaseImpl implements CreateConversationUseCase {
	constructor(
		@inject("ConversationRepository") private conversationRepository: ConversationRepository,

	) { }
	async execute(params: CreateConversationDTO): Promise<Either<Failure, Conversation>> {
		const newConversation = new Conversation({
			id: new ObjectID().toString(),
			members: params.members,
		});

		const conversation = await this.conversationRepository.store(newConversation);
		return conversation.fold(
			(error) => {
				return Left(error);
			},
			(populatedConversation) => {
				return Right(populatedConversation);
			});
	}
}

export { CreateConversationUseCaseImpl, CreateConversationUseCase }; 