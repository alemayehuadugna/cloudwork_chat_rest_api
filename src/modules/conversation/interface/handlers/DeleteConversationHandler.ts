const deleteConversationHandler = async (payload: any, response: any) => {

	console.log("deleteConversationHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { deleteConversationHandler };