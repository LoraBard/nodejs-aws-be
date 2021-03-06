import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";

export const getProductsById = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  const { id } = event.pathParameters;
  try {
    const product = await ProductService.getProductById(id);

    return createResponse(StatusCodes.OK, product);
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
