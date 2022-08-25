import { Failure } from "@/_boot/error/failure";
import { inject, injectable } from "inversify";
import { Either, Left, Right } from "monet";
import { Conversation } from "../domain/Conversation";
import { ConversationRepository } from "../domain/ConversationRepository";
import { ConversationCollection, ConversationSchema } from "./ConversationCollection";
import { ConversationMapper } from "./ConversationMapper";
import { DatabaseFailure } from '../../../_boot/error/failure';
import { Filter, ObjectId } from "mongodb";
import { from } from "uuid-mongodb";

@injectable()
class ConversationRepositoryImpl implements ConversationRepository {
	constructor(
		@inject("ConversationCollection") private conversationCollection: ConversationCollection
	) { }

	async store(conversation: Conversation): Promise<Either<Failure, Conversation>> {
		try {
			const ormConversation = ConversationMapper.toOrmEntity(conversation);
			// const conversationMembers: any = [];
			console.log("conversation-count-before-push");
			// ormConversation.members.forEach(element => { conversationMembers.push({ "userId": element.userId }) });
			// console.log("conversation-count-after-push ", conversationMembers);
			const count = await this.conversationCollection.countDocuments({ members: { $in: ormConversation.members } });
			console.log("conversation-count: ", count);
			if (count) {
				return Left(new DatabaseFailure("Conversation Already Exists"));
			}
			await this.conversationCollection.insertOne(ormConversation);

			let match: Filter<ConversationSchema> = {
				"_id": new ObjectId(conversation.id)
			}
			let addFields = {
				members: {
					$map: {
						input: "$members",
						as: "a",
						in: {
							$mergeObjects: [
								"$$a",
								{
									user: {
										$arrayElemAt: [
											{
												$filter: {
													input: "$test",
													cond: {
														$eq: ["$$a.userId", "$$this._id"],
													},
												},

											},
											0,
										],
									},

								},

							],
						},
					},
				},

				test: "$$REMOVE",
			};
			let populatedConversation: any;
			populatedConversation = await this.conversationCollection.aggregate([
				{
					$match: match
				},
				{
					$lookup: {
						from: 'freelancers',
						localField: 'members.userId',
						foreignField: '_id',
						as: 'test',
						pipeline: [
							{
								$project: {
									test: "$test",
									firstName: 1,
									lastName: 1,
									profilePicture: 1,
								},
							},
						],
					}
				},
				{
					$addFields: addFields
				},
				{
					$lookup: {
						from: 'clients',
						localField: 'members.userId',
						foreignField: '_id',
						as: 'test',
						pipeline: [
							{
								$project: {
									test: "$test",
									firstName: 1,
									lastName: 1,
									profilePicture: 1,
								},
							},
						],
					}
				},
				{
					$addFields: addFields
				}
			]).toArray();

			// console.log("not getting here");
			// console.log("populatedConversation: ", populatedConversation[0]);
			return Right(ConversationMapper.toDomainEntity(populatedConversation[0]));
		} catch (error) {
			console.log("Error: ", error);
			return Left(new DatabaseFailure("Error Saving Conversation"));
		}

	}

	async findById(conversationId: string): Promise<Either<Failure, Conversation>> {
		const conversation = await this.conversationCollection.findOne({ _id: new ObjectId(conversationId) });

		if (!conversation) {
			return Left(new DatabaseFailure("Conversation not found"))
		}

		return Right(ConversationMapper.toDomainEntity(conversation));
	}
	async find(userId: string, userType: string): Promise<Either<Failure, Conversation[]>> {

		let match: Filter<ConversationSchema> = {
			"members": {
				"$in": [
					{
						"userType": userType,
						"userId": from(userId)
					}
				]
			}
		};
		let addFields = {
			members: {
				$map: {
					input: "$members",
					as: "a",
					in: {
						$mergeObjects: [
							"$$a",
							{
								user: {
									$arrayElemAt: [
										{
											$filter: {
												input: "$test",
												cond: {
													$eq: ["$$a.userId", "$$this._id"],
												},
											},

										},
										0,
									],
								},

							},

						],
					},
				},
			},

			test: "$$REMOVE",
		};

		try {
			let conversations: any = [];

			if (userType === "Freelancer") {
				conversations = await this.conversationCollection.aggregate([
					{
						$match: match,
					},
					{
						$lookup: {
							from: 'clients',
							localField: 'members.userId',
							foreignField: '_id',
							as: 'test',
							pipeline: [
								{
									$project: {
										test: "$test",
										firstName: 1,
										lastName: 1,
										profilePicture: 1,
									},
								},
							],
						}
					},
					{
						$addFields: addFields
					},
					{
						$lookup: {
							from: 'messages',
							localField: '_id',
							foreignField: 'conversationId',
							as: 'lastMessage',
							pipeline: [
								{
									$sort: { 'sentAt': -1 }
								},
							]
						}
					},
					{
						$set: {
							lastMessage: {
								$arrayElemAt: ['$lastMessage', 0]
							}
						}
					}
				]).toArray();
			} else if (userType === "Client") {
				conversations = await this.conversationCollection.aggregate([
					{
						$match: match,
					},
					{
						$lookup: {
							from: 'freelancers',
							localField: 'members.userId',
							foreignField: '_id',
							as: 'test',
							pipeline: [
								{
									$project: {
										test: "$test",
										firstName: 1,
										lastName: 1,
										profilePicture: 1,
									},
								},
							],
						}
					},
					{
						$addFields: addFields
					},
					{
						$lookup: {
							from: 'messages',
							localField: '_id',
							foreignField: 'conversationId',
							as: 'lastMessage',
							pipeline: [
								{
									$sort: { 'sentAt': -1 }
								},
							]
						}
					},
					{
						$set: {
							lastMessage: {
								$arrayElemAt: ['$lastMessage', 0]
							}
						}
					}
				]).toArray();
			}
			console.log("gotHere!!!");
			console.log("conversation-lastMessage: ", ConversationMapper.toDomainEntities(conversations));
			return Right(ConversationMapper.toDomainEntities(conversations));
		} catch (error) {
			return Left(new DatabaseFailure("Error Listing Conversation"))
		}
	}
	async delete(conversationId: String): Promise<Either<Failure, void>> {
		throw new Error("Method not implemented.");
	}
}

export { ConversationRepositoryImpl };