import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { Session } from "../../domain/Session";
import { SessionRepository } from "../../domain/SessionRepository";

type RemoveSessionDTO = {
	sessionId: string;
	userId: string;
}

interface RemoveSessionUseCase {
	execute(params: RemoveSessionDTO): Promise<Either<Failure, Session>>;
}

@injectable()
class RemoveSessionUseCaseImpl implements RemoveSessionUseCase {
	constructor(
		@inject("SessionRepository") private sessionRepository: SessionRepository
	) { }

	async execute(params: RemoveSessionDTO): Promise<Either<Failure, Session>> {
		const userSession = await this.sessionRepository.get(params.userId);
		return userSession.fold(
			(error) => {
				return Left(error);
			},
			(result) => {
				const index = result.sessions.indexOf(params.sessionId, 0);
				if (index > -1) result.sessions.splice(index, 1);
				if (result.sessions.length === 0) result.isConnected = false;
				this.sessionRepository.store(result);
				return Right(result);
			}
		);
	}
}

export { RemoveSessionUseCase, RemoveSessionUseCaseImpl };