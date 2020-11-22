import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import schema from "../validation/createRequest";

export const createProduct = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  try {
    const body = JSON.parse(event.body);
    const { value } = schema.validate(body);
    await ProductService.createProduct(value);

    return createResponse(StatusCodes.CREATED, ReasonPhrases.CREATED);
  } catch (error) {
    const responseStatus = error.errorMessage
      ? StatusCodes.BAD_REQUEST
      : StatusCodes.INTERNAL_SERVER_ERROR;
    const responseMessage = error.errorMessage
      ? `${ReasonPhrases.BAD_REQUEST}. ${error.toString()}`
      : `${ReasonPhrases.INTERNAL_SERVER_ERROR}. ${error?.detail || error}`;
    return createResponse(responseStatus, responseMessage);
  }
};
