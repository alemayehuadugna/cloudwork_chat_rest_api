import { injectConversationModule } from "@/modules/conversation/injectConversation";
import { injectMessageModule } from "@/modules/message/injectMessage";
import { injectNotificationModule } from "@/modules/notification/injectNotification";
import { injectSessionModule } from "@/modules/session/injectSession";
import { Container } from "inversify";
import getDecorators from "inversify-inject-decorators";

const container = new Container();

const initInjection = async () => {
	await injectSessionModule();
	await injectConversationModule();
	await injectMessageModule();
	await injectNotificationModule();
}


const { lazyInject } = getDecorators(container);
export { lazyInject, container, initInjection };