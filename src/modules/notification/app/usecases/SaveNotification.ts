import { inject, injectable } from 'inversify';
import { Either, Left, Right } from "monet";
import { ObjectId } from "mongodb";
import { Failure } from '../../../../_boot/error/failure';
import { Notification } from "../../domain/Notification";
import { NotificationRepository } from "../../domain/NotificationRepository";

type SaveNotificationDTO = {
	userId: string;
	title: string;
	message: string;
}

interface SaveNotificationUseCase {
	execute(params: SaveNotificationDTO): Promise<Either<Failure, Notification>>;
}

@injectable()
class SaveNotificationUseCaseImpl implements SaveNotificationUseCase {
	constructor(
		@inject("NotificationRepository") private notificationRepository: NotificationRepository
	) { }

	async execute(params: SaveNotificationDTO): Promise<Either<Failure, Notification>> {
		const newNotification = new Notification({
			id: new ObjectId().toString(),
			userId: params.userId,
			title: params.title,
			message: params.message,
			isRead: false,
			sentAt: new Date()
		});

		const notification = await this.notificationRepository.store(newNotification);
		return notification.fold(
			(error) => {
				return Left(error);
			},
			(notification) => {
				return Right(notification);
			}
		)
	}
}

export { SaveNotificationUseCase, SaveNotificationUseCaseImpl };