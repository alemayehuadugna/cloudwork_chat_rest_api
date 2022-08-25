const deleteMessageHandler = async (payload: any, response: any) => {

	console.log("deleteMessageHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { deleteMessageHandler };