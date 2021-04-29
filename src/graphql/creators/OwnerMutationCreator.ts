import { Mutation } from '../../video.interface';
import { MutationCreator } from '../Factory';
import OwnerMutation from '../mutations/OwnerMutaton';

export default class OwnerMutationCreator extends MutationCreator {
  public factoryMethod(): Mutation {
    return new OwnerMutation();
  }
}
