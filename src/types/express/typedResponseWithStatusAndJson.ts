import { HTTP_STATUSES_ENUM } from "../HttpStatusesEnum";
import { TypedResponseMessage } from "./typedResponseMessage";

export type TypedResponseWithStatusAndJson<R> = {
	status: HTTP_STATUSES_ENUM,
	response?: R | TypedResponseMessage
}