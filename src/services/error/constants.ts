import { templateParts } from "../../constants/templateParts";

export const errorMessages = {
	emptyField: `Field - ${templateParts.value} is required.`,
	elementNotFound: `Element is not found in DB.`,
	wrongLoginOrPassword: "Wrong login or password.",
	unexpectedErrorOccurred: "An unexpected error occurred.",
	unauthorizedErrorOccurred: "Unauthorized error occurred.",
};
