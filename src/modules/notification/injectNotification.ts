import { container } from "@/_boot/di"
import { ListNotificationUseCase, ListNotificationUseCaseImpl } from "./app/usecases/ListNotifications";
import { SaveNotificationUseCase, SaveNotificationUseCaseImpl } from "./app/usecases/SaveNotification";
import { NotificationRepository } from "./domain/NotificationRepository";
import { initNotificationCollection, NotificationCollection } from "./infra/NotificationCollection"
import { NotificationRepositoryImpl } from "./infra/NotificationRepositoryImpl";

const injectNotificationModule = async () => {
	container
		.bind<NotificationCollection>('NotificationCollection')
		.toConstantValue(await initNotificationCollection());
	container
		.bind<NotificationRepository>('NotificationRepository')
		.to(NotificationRepositoryImpl).inSingletonScope();
	container
		.bind<SaveNotificationUseCase>('SaveNotificationUseCase')
		.to(SaveNotificationUseCaseImpl).inSingletonScope();
	container
		.bind<ListNotificationUseCase>('ListNotificationUseCase')
		.to(ListNotificationUseCaseImpl).inSingletonScope();
}

export { injectNotificationModule };