import { Failure } from "@/_boot/error/failure";
import { Either } from "monet";
import { Session } from "./Session";

interface SessionRepository {
	get(userId: String): Promise<Either<Failure, Session>>;
	store(session: Session): Promise<Either<Failure, void>>;
	findAll(): Promise<Either<Failure, Session[]>>;
}

export { SessionRepository };