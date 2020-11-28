import {
  Context,
  APIGatewayTokenAuthorizerEvent,
  APIGatewayAuthorizerCallback,
} from "aws-lambda";
import * as dotenv from "dotenv";

dotenv.config();

export const basicAuthorizer = async (
  event: APIGatewayTokenAuthorizerEvent,
  context: Context,
  callback: APIGatewayAuthorizerCallback
): Promise<void> => {
  console.log(
    `Event:\n ${JSON.stringify(event)}\nContext:\n${JSON.stringify(context)}`
  );
  try {
    const { type, authorizationToken } = event;

    if (type !== "TOKEN") {
      callback("Unauthorized");
    }
    const token = authorizationToken.split(" ")[1];
    const [username, password] = Buffer.from(token, "base64")
      .toString("utf-8")
      .split(":");
    console.log(`username: ${username}, password: ${password}`);
    if (username !== process.env.USERNAME) {
      callback("Unauthorized");
      return;
    }
    const storedPassword = process.env[username];
    const effect =
      !storedPassword || storedPassword !== password ? "Deny" : "Allow";
    const policy = generatePolicy(token, effect, event.methodArn);
    callback(null, policy);
  } catch (error) {
    callback(`Unauthorized: ${error.message}`);
  }
};

const generatePolicy = function (principalId, effect, resource) {
  return {
    principalId,
    policyDocument: {
      Version: "2012-10-17",
      Statement: [
        {
          Action: "execute-api:Invoke",
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
};
