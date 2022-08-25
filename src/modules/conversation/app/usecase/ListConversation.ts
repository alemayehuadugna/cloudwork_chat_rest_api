import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Conversation } from "../../domain/Conversation";
import { ConversationRepository } from "../../domain/ConversationRepository";


type ListConversationDTO = {
	userId: string;
	userType: string;
}

interface ListConversationUseCase {
	execute(params: ListConversationDTO): Promise<Either<Failure, Conversation[]>>;
}

@injectable()
class ListConversationUseCaseImpl implements ListConversationUseCase {
	constructor(
		@inject("ConversationRepository") private conversationRepository: ConversationRepository
	) { }
	async execute(params: ListConversationDTO): Promise<Either<Failure, Conversation[]>> {
		
		return await this.conversationRepository.find(params.userId, params.userType);
	}
}

export { ListConversationUseCaseImpl, ListConversationUseCase };