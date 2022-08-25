import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from 'inversify';
import { Either } from "monet";
import { Notification } from "../../domain/Notification";
import { NotificationRepository } from "../../domain/NotificationRepository";

type ListNotificationDTO = {
	userId: string;
	pagination: any;
	filter: any;
}

interface ListNotificationUseCase {
	execute(params: ListNotificationDTO): Promise<Either<Failure, Notification[]>>;
}

@injectable()
class ListNotificationUseCaseImpl implements ListNotificationUseCase {
	constructor(
		@inject("NotificationRepository") private notificationRepository: NotificationRepository
	) { }

	async execute(params: ListNotificationDTO): Promise<Either<Failure, Notification[]>> {
		return await this.notificationRepository.find(params);
	}
}

export { ListNotificationUseCaseImpl, ListNotificationUseCase }