import { container, lazyInject } from "@/_boot/di";
import { Socket } from "socket.io";
import { StoreSessionUseCase } from "../../app/usecase/SaveSession";

const storeSessionHandler = async (socket: Socket) => {

	const storeSessionUseCase = container.get<StoreSessionUseCase>("StoreSessionUseCase");

	await storeSessionUseCase.execute({
		sessionId: socket.data.sessionId,
		userId: socket.data.userId
	});
}

export { storeSessionHandler };