import { conversationHandlers } from "@/modules/conversation/interface/handlers";
import { messageHandlers } from "@/modules/message/interface/handlers";
import { notificationHandlers } from "@/modules/notification/interface/handlers";
import { sessionHandlers } from "@/modules/session/interface/handlers";
import { Socket } from "socket.io";

const registerModules = (socket: Socket) => {

	sessionHandlers(socket);
	conversationHandlers(socket);
	messageHandlers(socket);
	notificationHandlers(socket);

} 

export { registerModules };