import { Mutation } from '../video.interface';

export default abstract class MutationCreator {
  public abstract factoryMethod(): Mutation;
}