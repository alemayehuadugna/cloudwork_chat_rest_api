import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Message } from "../../domain/Message";
import { MessageRepository } from "../../domain/MessageRepository";

type ListMessageDTO = {
	conversationId: string;
	pagination: any;
	filter: any;
}

interface ListMessageUseCase {
	execute(params: ListMessageDTO): Promise<Either<Failure, Message[]>>;
}

@injectable()
class ListMessageUseCaseImpl implements ListMessageUseCase {
	constructor(
		@inject("MessageRepository") private messageRepository: MessageRepository
	) { }
	async execute(params: ListMessageDTO): Promise<Either<Failure, Message[]>> {
		return await this.messageRepository.find(params.conversationId, params.pagination, params.filter);
	}
}

export { ListMessageUseCaseImpl, ListMessageUseCase }