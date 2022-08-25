import { DatabaseFailure, Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { Session } from "../domain/Session";
import { SessionRepository } from "../domain/SessionRepository";
import { SessionCollection } from "./SessionCollection";
import { SessionMapper } from "./SessionMapper";

@injectable()
class SessionRepositoryImpl implements SessionRepository {

	constructor(
		@inject("SessionCollection") private sessionCollection: SessionCollection
	) { }

	async get(userId: String): Promise<Either<Failure, Session>> {
		const session = await this.sessionCollection.findOne({ userId: userId });

		if (!session) {
			return Left(new DatabaseFailure("Session not found"));
		}

		return Right(SessionMapper.toDomainEntity(session));

	}
	async store(session: Session): Promise<Either<Failure, void>> {
		try {
			const ormSession = SessionMapper.toOrmEntity(session);
			const count = await this.sessionCollection.countDocuments({ _id: ormSession._id });
			if (count) {
				await this.sessionCollection.updateOne(
					{ _id: ormSession._id },
					{
						$set: {
							...ormSession
						}
					}
				)
				return Right(undefined);
			}

			await this.sessionCollection.insertOne(ormSession)
			return Right(undefined);
		} catch (error) {
			return Left(new DatabaseFailure("Error Saving Session"));
		}
	}
	async findAll(): Promise<Either<Failure, Session[]>> {
		try {
			const allSessions = await this.sessionCollection.find().map((e) => {
				return new Session({
					id: e._id.toString(),
					userId: e.userId,
					isConnected: e.isConnected,
					sessions: e.sessions
				});
			}).toArray();
			return Right(allSessions);
		} catch (error) {
			return Left(new DatabaseFailure("error getting sessions"));
		}
	}
}

export { SessionRepositoryImpl };