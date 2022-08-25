import { container } from "@/_boot/di"
import { ListMessageUseCase, ListMessageUseCaseImpl } from "./app/usecase/ListMessage";
import { SaveMessageUseCase, SaveMessageUseCaseImpl } from "./app/usecase/SaveMessage";
import { MessageRepository } from "./domain/MessageRepository";
import { initMessageCollection, MessageCollection } from "./infra/MessageCollection"
import { MessageRepositoryImpl } from "./infra/MessageRepositoryImpl";

const injectMessageModule = async () => {
	container
		.bind<MessageCollection>('MessageCollection')
		.toConstantValue(await initMessageCollection());
	container
		.bind<MessageRepository>('MessageRepository')
		.to(MessageRepositoryImpl).inSingletonScope();
	container
		.bind<SaveMessageUseCase>('SaveMessageUseCase')
		.to(SaveMessageUseCaseImpl).inSingletonScope();
	container
		.bind<ListMessageUseCase>('ListMessageUseCase')
		.to(ListMessageUseCaseImpl).inSingletonScope();
}

export { injectMessageModule };