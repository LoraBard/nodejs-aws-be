import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import ProductService from "../productsService";
import createResponse from "../helpers/createResponse";
import createReponse from "../helpers/createResponse";

export const getProductsList = async (
  event: APIGatewayEvent,
  context: Context
): Promise<APIGatewayProxyResult> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  try {
    const productsList = await ProductService.getProductsList();

    return createResponse(StatusCodes.OK, productsList);
  } catch (error) {
    return createReponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${ReasonPhrases.INTERNAL_SERVER_ERROR}. ${error.toString()}`
    );
  }
};
