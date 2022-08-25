import { injectable } from "inversify";
import { Server, Socket } from "socket.io";
import { container, lazyInject } from "./di";
import "reflect-metadata";
import { createServer } from "http";
import { registerModules } from "./registerModules";
import crypto from 'crypto';


const PORT = process.env.PORT || 3030;
const URL = process.env.LISTENING_URL as string;
const httpServer = createServer();
const io = new Server(httpServer, {
	cors: {
		origin: URL,
	},
});

const initSocketServer = async () => {

	container.bind<Server>('IO').toConstantValue(io);

	io.use(async (socket, next) => {
		const sessionId: String = socket.handshake.auth.sessionId;
		const userId: String = socket.handshake.auth.userId;
		if (sessionId && userId) {
			socket.data.sessionId = sessionId;
			socket.data.userId = userId;
			return next();
		}
		if (!userId) {
			console.log('user called')
			return next(new Error("invalid id"));
		}
		const randomId = () => crypto.randomBytes(8).toString("hex");
		socket.data.sessionId = randomId();
		socket.data.userId = userId;
		return next();
	});

	await io.on('connection', (socket: Socket) => {
		console.log(`Client Connected With socket Id - ${socket.id}`);

		registerModules(socket);
	});

	httpServer.listen(PORT, () => {
		console.log(`server listening at http://localhost:${PORT}`);
	});
}


export { initSocketServer };