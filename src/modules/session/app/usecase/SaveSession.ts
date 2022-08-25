import { Session, SessionType } from "../../domain/Session";
import { Failure } from '../../../../_boot/error/failure';
import { Either, Left, Right } from "monet";
import { inject, injectable } from "inversify";
import { SessionRepository } from "../../domain/SessionRepository";
import { ObjectID } from 'bson';

type SaveSessionDTO = {
	sessionId: string;
	userId: string;
}

interface StoreSessionUseCase {
	execute(session: SaveSessionDTO): Promise<Either<Failure, void>>;
}

@injectable()
class StoreSessionUseCaseImpl implements StoreSessionUseCase {
	constructor(
		@inject("SessionRepository") private sessionRepository: SessionRepository
	) { }

	async execute(session: SaveSessionDTO): Promise<Either<Failure, void>> {
		const userSession = await this.sessionRepository.get(session.userId);

		return userSession.cata(
			(error) => {
				let userSessions = [session.sessionId];
				const newUserSession = new Session({
					sessions: userSessions,
					userId: session.userId,
					isConnected: true,
					id: new ObjectID().toString()
				});
				this.sessionRepository.store(newUserSession);
				return Left(error)
			},
			(result) => {
				if (!result.sessions.includes(session.sessionId)) {
					result.addNewSession(session.sessionId);
					result.isConnected = true;
					this.sessionRepository.store(result);
				}
				return Right(undefined)
			},
		);
	}
}

export { StoreSessionUseCase, StoreSessionUseCaseImpl };
