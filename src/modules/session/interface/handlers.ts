import { container } from "@/_boot/di";
import { Socket } from "socket.io";
import { removeSessionHandler } from "./handlers/RemoveSessionHandler";
import { storeSessionHandler } from "./handlers/SaveSessionHandler";

const sessionHandlers = (socket: Socket) => {

	// persist session
	storeSessionHandler(socket);

	// emit session details
	socket.emit("/session/me", {
		sessionId: socket.data.sessionId,
		userId: socket.data.userId,
	});

	// join the "userId" room
	socket.join(socket.data.userId);

	socket.on("disconnect", async () => {
		console.log(`Client Disconnected ${socket.id}`);

		const result = await removeSessionHandler(socket);

		result.cata(
			() => { },
			(session) => {
				if (!session.isConnected) {
					socket.broadcast.emit("user-disconnected", session);
				}
			}
		)
	});

}

export { sessionHandlers };