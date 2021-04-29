import { AbstractFactory, Mutation, Query } from '../Interfaces';
import OwnerMutation from './mutations/OwnerMutaton';
import TokenMutation from './mutations/TokenMutation';
import OwnerQuery from './queries/OwnerQuery';
import TokenQuery from './queries/TokenQuery';

export class OwnerFactory implements AbstractFactory {
  createMutation(): Mutation {
    return new OwnerMutation();
  }
  createQuery(): Query {
    return new OwnerQuery();
  }
}

export class TokenFactory implements AbstractFactory {
  createMutation(): Mutation {
    return new TokenMutation();
  }

  createQuery(): Query {
    return new TokenQuery();
  }
}
