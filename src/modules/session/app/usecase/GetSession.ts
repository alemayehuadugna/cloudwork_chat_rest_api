import { Failure } from '../../../../_boot/error/failure';
import { Session } from '../../domain/Session';
import { Either } from 'monet';
import { inject } from 'inversify';
import { SessionRepository } from '../../domain/SessionRepository';


interface GetSessionUseCase {
	execute(userId: string): Promise<Either<Failure, Session>>
}

class GetSessionUseCaseImpl implements GetSessionUseCase {
	constructor(
		@inject("SessionRepository") private sessionRepository: SessionRepository
	) { }

	async execute(userId: string): Promise<Either<Failure, Session>> {
		return await this.sessionRepository.get(userId);
	}
}