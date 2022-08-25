import { DatabaseFailure, Failure } from "@/_boot/error/failure";
import { inject, injectable } from 'inversify';
import { Either, Left, Right } from "monet";
import { Filter, ObjectId } from "mongodb";
import { from } from "uuid-mongodb";
import { NotificationType, Notification } from "../domain/Notification";
import { NotificationRepository } from "../domain/NotificationRepository";
import { NotificationCollection, NotificationSchema } from "./NotificationCollection";
import { NotificationMapper } from "./NotificationMapper";

@injectable()
class NotificationRepositoryImpl implements NotificationRepository {
	constructor(
		@inject('NotificationCollection') private notificationCollection: NotificationCollection
	) { }

	async store(notification: Notification): Promise<Either<Failure, Notification>> {
		try {
			const ormNotification = NotificationMapper.toOrmEntity(notification);
			const count = await this.notificationCollection.countDocuments({ _id: ormNotification._id });

			if (count) {
				await this.notificationCollection.updateOne(
					{ _id: ormNotification._id },
					{
						$set: {
							...ormNotification
						}
					}
				)
				return Right(NotificationMapper.toDomainEntity(ormNotification));
			}

			await this.notificationCollection.insertOne(ormNotification);
			return Right(NotificationMapper.toDomainEntity(ormNotification));
		} catch (error) {
			return Left(new DatabaseFailure("Error Saving Notification"));
		}
	}

	async findById(notificationId: string): Promise<Either<Failure, Notification>> {
		const notification = await this.notificationCollection.findOne({ _id: new ObjectId(notificationId) });

		if (!notification) {
			return Left(new DatabaseFailure("Notification not found"));
		}

		return Right(NotificationMapper.toDomainEntity(notification));
	}

	async find({userId, pagination, sort}: any): Promise<Either<Failure, Notification[]>> {
		let match: Filter<NotificationSchema> = {
			userId: from(userId)
		}

		try {
			const notifications = await this.notificationCollection.aggregate([
				{ $match: match },
				{ $sort: { sentAt: -1 } }
			]).toArray();

			return Right(NotificationMapper.toDomainEntities(notifications));
		} catch (error) {
			return Left(new DatabaseFailure("Error Getting User Notifications"))
		}
	}

	async delete(notificationId: string): Promise<Either<Failure, void>> {
		throw new Error("Method not implemented.");
	}
}

export { NotificationRepositoryImpl };