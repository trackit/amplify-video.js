export const hasOperationName = (req, operationName) => {
  const { body } = req;
  return body.hasOwnProperty('query') && body.query.includes(operationName);
};

export const aliasMutation = (req, operationName) => {
  if (hasOperationName(req, operationName)) {
    req.alias = operationName;
  }
};

export const responseAssertionNotNull = ({ interception, target, id }) => {
  const data = interception.response.body.data[target];
  expect(data).to.not.equal(null);
  if (!id) return;
  expect(data.id).to.equal(id);
};

export const responseAssertionNull = (interception, target) => {
  expect(interception.response.body.data[target]).to.equal(null);
};
