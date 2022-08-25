
import { Socket } from "socket.io";
import { container, lazyInject } from "../../_boot/di";
import { RemoveSessionUseCase, RemoveSessionUseCaseImpl } from "./app/usecase/RemoveSession";
import { StoreSessionUseCase, StoreSessionUseCaseImpl } from "./app/usecase/SaveSession";
import { SessionRepository } from "./domain/SessionRepository";
import { initSessionCollection, SessionCollection } from "./infra/SessionCollection";
import { SessionRepositoryImpl } from "./infra/SessionRepositoryImpl";


const injectSessionModule = async () => {

	container
		.bind<SessionCollection>('SessionCollection')
		.toConstantValue(await initSessionCollection());
	container
		.bind<SessionRepository>('SessionRepository')
		.to(SessionRepositoryImpl).inSingletonScope();
	container
		.bind<StoreSessionUseCase>('StoreSessionUseCase')
		.to(StoreSessionUseCaseImpl).inSingletonScope();
	container
		.bind<RemoveSessionUseCase>('RemoveSessionUseCase')
		.to(RemoveSessionUseCaseImpl).inSingletonScope();

}

export { injectSessionModule };