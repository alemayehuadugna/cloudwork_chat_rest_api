const listMessageHandler = async (payload: any, response: any) => {

	console.log("listMessageHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { listMessageHandler };