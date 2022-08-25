import { container } from "@/_boot/di";
import { Server, Socket } from "socket.io";
import { ListMessageUseCase } from "../app/usecase/ListMessage";
import { SaveMessageUseCase } from "../app/usecase/SaveMessage";

const messageHandlers = (socket: Socket) => {
	const io = container.get<Server>('IO');

	socket.on("send-message", async (payload: any, response: any) => {
		const saveMessage = container.get<SaveMessageUseCase>('SaveMessageUseCase');
		const result = await saveMessage.execute({
			conversationId: payload.conversationId,
			senderId: socket.data.userId,
			content: payload.content,
			sent: true,
			seen: false,
			sentAt: new Date(),
			updatedAt: new Date(),
		});

		result.cata(
			() => { },
			(message) => {
				io.in(payload.conversationId).emit("new-message", message);
				console.log("sendMessageHandler>message: ", message);

				response({
					statusCode: 200,
				})
			}
		);


	});

	socket.on("load-message", async (payload: any, response: any) => {

		const listMessage = container.get<ListMessageUseCase>('ListMessageUseCase');
		const result = await listMessage.execute({
			conversationId: payload.conversationId,
			pagination: payload.pagination,
			filter: payload.filter,
		});
		// console.log("load-message::payload:> ", payload);
		result.cata(
			(error) => { 
				// console.log("loadMessageError ", error);
			},
			(messages) => {
				// console.log("loadedMessage: ", messages);
				response({
					data: messages,
					statusCode: 200,
				})
			}
		);
	});

	socket.on("delete-message", async (payload: any, response: any) => {

		console.log("deleteMessageHandler>payload: ", payload);

		response({
			statusCode: 200,
		})
	});
}

export { messageHandlers };