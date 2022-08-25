import { Socket } from "socket.io";
import { container } from '@/_boot/di';
import { RemoveSessionUseCase } from "../../app/usecase/RemoveSession";

const removeSessionHandler = async (socket: Socket) => {
	const removeSessionUseCase = container.get<RemoveSessionUseCase>("RemoveSessionUseCase");

	return await removeSessionUseCase.execute({
		sessionId: socket.data.sessionId,
		userId: socket.data.userId
	});
}

export { removeSessionHandler };