const createReponse = (statusCode: number, data: string) => ({
  statusCode,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: data,
});

export default createReponse;
