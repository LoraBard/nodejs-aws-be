import { APIGatewayProxyResult, APIGatewayEvent, Context } from "aws-lambda";
import * as AWS from "aws-sdk";
import { ReasonPhrases, StatusCodes } from "http-status-codes";
import * as dotenv from 'dotenv';

import createResponse from "../helpers/createResponse";

dotenv.config();

export const importProductsFile = async (
  event: APIGatewayEvent,
  context?: Context
): Promise<APIGatewayProxyResult> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  try {
    const { BUCKET } = process.env;
    const catalogName = event.queryStringParameters?.name;
    if (!catalogName) {
      return createResponse(StatusCodes.BAD_REQUEST, 'parameter name is not provided');
    }
    const catalogPath = `uploaded/${catalogName}`;

    const s3 = new AWS.S3({ region: "eu-west-1", signatureVersion: "v4" });
    const params = {
      Bucket: BUCKET,
      Key: catalogPath,
      Expires: 60,
      ContentType: "text/csv",
    };
    const signedUrl = await s3.getSignedUrlPromise("putObject", params);

    return createResponse(StatusCodes.OK, signedUrl);
  } catch (error) {
    return createResponse(
      StatusCodes.INTERNAL_SERVER_ERROR,
      `${ReasonPhrases.INTERNAL_SERVER_ERROR}. ${error.toString()}`
    );
  }
};
