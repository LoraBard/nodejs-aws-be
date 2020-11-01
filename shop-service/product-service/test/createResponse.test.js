import createResponse from "../helpers/createResponse";

describe("create response", () => {
  const responseMock = {
    statusCode: 200,
    headers: { "Content-Type": "application/json" },
    body: "{\"message\":\"test data\"}",
  };

  it("send well-formed response", () => {
    const result = createResponse(200, {
        message: 'test data'
    });
    expect(result).toEqual(responseMock);
  });
});
