import { StringObjectDictionary } from "../dictionaries";

export interface ResponseMessage {
	messages: StringObjectDictionary[];
}

export type TypedResponseMessage = ResponseMessage;