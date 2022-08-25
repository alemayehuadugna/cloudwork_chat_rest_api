import { Failure } from "@/_boot/error/failure";
import { Either } from "monet";
import { Notification, NotificationType } from "./Notification";

interface NotificationRepository {
	store(notification: Notification): Promise<Either<Failure, Notification>>;
	findById(notificationId: string): Promise<Either<Failure, Notification>>;
	find({userId, pagination, sort}: any): Promise<Either<Failure, Notification[]>>;
	delete(notificationId: string): Promise<Either<Failure, void>>;
}

export { NotificationRepository };