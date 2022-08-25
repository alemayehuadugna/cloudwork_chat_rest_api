const sendMessageHandler = async (payload: any, response: any) => {

	console.log("sendMessageHandler>payload: ", payload);

	response({
		statusCode: 200,
	})
}

export { sendMessageHandler };