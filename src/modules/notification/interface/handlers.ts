import { container } from "@/_boot/di";
import { Server, Socket } from "socket.io";
import { ListNotificationUseCase } from "../app/usecases/ListNotifications";
import { SaveNotificationUseCase } from "../app/usecases/SaveNotification";

const notificationHandlers = (socket: Socket) => {
	const io = container.get<Server>('IO');

	socket.on('send-notification', async (payload: any, response: any) => {
		console.log("sendNotificationHandler-payload: ", payload);
		const saveNotification = container.get<SaveNotificationUseCase>('SaveNotificationUseCase');
		const result = await saveNotification.execute({
			title: payload.title,
			message: payload.message,
			userId: payload.userId
		});

		result.cata(
			() => { },
			(notification) => {
				io.to(payload.userId).emit('new-notification', notification);
				console.log("sendNotificationHandler-notification: ", notification);

				response({
					data: notification,
					statusCode: 200,
				})
			}
		);
	});

	socket.on('load-notification', async (payload: any, response: any) => {
		console.log("loadNotificationHandler-payload: ", payload);
		const loadNotification = container.get<ListNotificationUseCase>('ListNotificationUseCase');
		const result = await loadNotification.execute({
			userId: payload.userId,
			pagination: null,
			filter: null
		});
		result.cata(
			(error) => {

			},
			(notifications) => {
				response({
					data: notifications,
					statusCode: 200,
				})
			}
		)
	});

	socket.on('delete-notification', async (payload: any, response: any) => {
		console.log("deleteNotificationHandler-payload: ", payload);

		response({
			statusCode: 200,
		})
	})
}

export { notificationHandlers };