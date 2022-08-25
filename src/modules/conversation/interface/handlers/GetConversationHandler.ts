const getConversationHandler = async (payload: any, response: any) => {

	console.log("GetConversationHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { getConversationHandler };