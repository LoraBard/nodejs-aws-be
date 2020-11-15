import * as awsMock from "aws-sdk-mock";
import { ReasonPhrases, StatusCodes } from "http-status-codes";

import { importProductsFile } from "../importProductsFile";
import * as event from "../../mockData/event.json";


describe("import service", () => {
  beforeEach(() => {
    process.env.BUCKET = "bucket";
    awsMock.restore();
  });

  it("provide right params", async () => {
    const expectedParams = {
      Bucket: "bucket",
      Key: `uploaded/${event.queryStringParameters.name}`,
      Expires: 60,
      ContentType: "text/csv",
    };
    const signedUrl = "some url";
    awsMock.mock("S3", "getSignedUrl", (_action, params, callback) => {
      callback(null, signedUrl);
      expect(params).toEqual(expectedParams);
    });
  });

  it("return well-formed response", async () => {
    const signedUrl = "some url";
    const expectedResponse = {
      statusCode: 200,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: signedUrl,
    };
    awsMock.mock("S3", "getSignedUrl", (_action, _params, callback) => {
      callback(null, signedUrl);
    });

    const response = await importProductsFile(event as any);

    expect(response).toEqual(expectedResponse);
  });

  it("return statusCode 400 when there is no name param", async () => {
    const signedUrl = "some url";
    const expectedResponse = {
      statusCode: StatusCodes.BAD_REQUEST,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: "parameter name is not provided",
    };
    const mockedEvent = {
      queryStringParameters: {},
    };
    awsMock.mock("S3", "getSignedUrl", (_action, _params, callback) => {
      callback(null, signedUrl);
    });

    const response = await importProductsFile(mockedEvent as any);

    expect(response).toEqual(expectedResponse);
  });

  it("return statusCode 500 when error is occured", async () => {
    const errorString = "Some error string";
    const expectedResponse = {
      statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
      headers: { "Access-Control-Allow-Origin": "*" },
      body: `${ReasonPhrases.INTERNAL_SERVER_ERROR}. ${errorString}`,
    };
    awsMock.mock("S3", "getSignedUrl", (_action, _params, _callback) => {
      throw `${errorString}`;
    });

    const response = await importProductsFile(event as any);

    expect(response).toEqual(expectedResponse);
  });
});
