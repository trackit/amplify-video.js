import { MutationCreator } from '../factory';
import { Mutation } from '../video.interface';

export default class OwnerMutationCreator extends MutationCreator {
  public factoryMethod(): Mutation {
    return new OwnerMutation();
  }
}
