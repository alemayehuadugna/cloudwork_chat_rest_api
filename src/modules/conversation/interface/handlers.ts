import { container } from "@/_boot/di";
import { Server, Socket } from "socket.io";
import { CreateConversationUseCase } from "../app/usecase/CreateConversation";
import { ListConversationUseCase } from "../app/usecase/ListConversation";
import { createConversationHandler } from "./handlers/CreateConversationHandler";
import { deleteConversationHandler } from "./handlers/DeleteConversationHandler";
import { getConversationHandler } from "./handlers/GetConversationHandler";
import { listConversationHandler } from "./handlers/ListConversationHandler";

const conversationHandlers = (socket: Socket) => {
	const io = container.get<Server>('IO');

	socket.on('join-conversation', async (conversation) => {
		socket.join(conversation._id);
	});


	socket.on("create-conversation", async (payload: any, response: any) => {
		const createConversationUseCase = container.get<CreateConversationUseCase>('CreateConversationUseCase');
		const result = await createConversationUseCase.execute({ members: payload.members, userId: socket.data.userId });
		return result.cata(
			(error) => {
				response({
					error: error.message,
					statusCode: 400
				})
			},
			(conversation) => {
				console.log("conversation: ", conversation);
				// join the new conversation 
				socket.join(conversation.id);
				// inform other user about the new conversation
				payload.members.forEach((e) => {
					if (e.userId != socket.data.userId) {
						socket.to(e.userId).emit('new-conversation', conversation);
					}
				});

				response({
					data: conversation,
					statusCode: 200,
				});
			},
		);


	});
	socket.on('get-conversation', getConversationHandler);
	socket.on('delete-conversation', deleteConversationHandler);
	socket.on('list-conversation', async (payload: any, response: any) => {

		const listConversationUseCase = container.get<ListConversationUseCase>('ListConversationUseCase');
		const result = await listConversationUseCase.execute(payload);
		return result.cata(
			(_) => {
				response({
					statusCode: 200,
				})
			},
			(conversationList) => {

				conversationList.forEach((e) => {
					socket.join(e.id);
				});
				console.log("conversationList-before-going_out> ", conversationList);

				response({
					data: conversationList,
					statusCode: 200,
				});
			}
		);
	});
}

export { conversationHandlers };