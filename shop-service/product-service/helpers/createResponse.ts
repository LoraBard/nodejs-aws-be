const createReponse = (statusCode: number, data: object) => ({
  statusCode,
  headers: {
    "Content-Type": "application/json"
  },
  body: JSON.stringify(data)
});
  
export default createReponse;