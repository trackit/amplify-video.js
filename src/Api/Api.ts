import { graphqlOperation } from '@aws-amplify/api';
import BaseApi from './BaseApi';

class Api extends BaseApi {
  public async graphQlOperation({ input, mutation }) {
    return this.instance.graphql(graphqlOperation(mutation, input));
  }
}

export default Api;
