import { ObjectID } from "bson";
import { Session } from "../domain/Session";
import { SessionSchema } from "./SessionCollection";

const SessionMapper = {
	toOrmEntity: (domainEntity: Session) => ({
		_id: new ObjectID(domainEntity.id),
		userId: domainEntity.userId,
		isConnected: domainEntity.isConnected,
		sessions: domainEntity.sessions,
	}),
	toDomainEntity: (ormEntity: SessionSchema) => (new Session({
		id: ormEntity._id.toString(),
		isConnected: ormEntity.isConnected,
		userId: ormEntity.userId,
		sessions: ormEntity.sessions
	})),
}

export { SessionMapper };