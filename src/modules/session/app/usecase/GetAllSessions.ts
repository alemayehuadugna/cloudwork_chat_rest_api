import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either } from "monet";
import { Session } from "../../domain/Session";
import { SessionRepository } from "../../domain/SessionRepository";

interface GetAllSessionsUseCase {
	execute(): Promise<Either<Failure, Session[]>>;
}

@injectable()
class GetAllSessionsUseCaseImpl implements GetAllSessionsUseCase {
	constructor(
		@inject("SessionRepository") private sessionRepository: SessionRepository
	) { }

	async execute(): Promise<Either<Failure, Session[]>> {
		return await this.sessionRepository.findAll();
	}
}

export { GetAllSessionsUseCase, GetAllSessionsUseCaseImpl };