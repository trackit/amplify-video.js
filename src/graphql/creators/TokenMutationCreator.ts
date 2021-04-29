import { Mutation } from '../../video.interface';
import { MutationCreator } from '../Factory';
import TokenMutation from '../mutations/TokenMutation';

export default class TokenMutationCreator extends MutationCreator {
  public factoryMethod(): Mutation {
    return new TokenMutation();
  }
}
