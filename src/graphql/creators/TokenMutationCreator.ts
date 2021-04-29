import { MutationCreator } from '../factory';
import { Mutation } from '../video.interface';

export default class TokenMutationCreator extends MutationCreator {
  public factoryMethod(): Mutation {
    return new TokenMutation();
  }
}
