import { container } from "@/_boot/di";
import { Socket } from "socket.io";
import { CreateConversationUseCase } from "../../app/usecase/CreateConversation";

const createConversationHandler = async (payload: any, response: any) => {
	console.log("CreateConversationHandler>payload: ", payload);

	response({
		statusCode: 200,
	});
}

export { createConversationHandler };