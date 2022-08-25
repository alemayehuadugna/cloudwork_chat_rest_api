import { container } from '@/_boot/di';
import { CreateConversationUseCase, CreateConversationUseCaseImpl } from './app/usecase/CreateConversation';
import { ListConversationUseCase, ListConversationUseCaseImpl } from './app/usecase/ListConversation';
import { ConversationRepository } from './domain/ConversationRepository';
import { ConversationCollection, initConversationCollection } from './infra/ConversationCollection';
import { ConversationRepositoryImpl } from './infra/ConversationRepositoryImpl';

const injectConversationModule = async () => {

	container
		.bind<ConversationCollection>('ConversationCollection')
		.toConstantValue(await initConversationCollection());
	container
		.bind<ConversationRepository>('ConversationRepository')
		.to(ConversationRepositoryImpl).inSingletonScope();
	container
		.bind<CreateConversationUseCase>('CreateConversationUseCase')
		.to(CreateConversationUseCaseImpl).inSingletonScope();
	container
		.bind<ListConversationUseCase>('ListConversationUseCase')
		.to(ListConversationUseCaseImpl).inSingletonScope();

}

export { injectConversationModule };