
const listConversationHandler = async (payload: any, response: any) => {

	console.log("listConversationHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { listConversationHandler };