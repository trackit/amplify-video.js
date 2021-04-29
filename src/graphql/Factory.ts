import { Mutation, Query } from '../video.interface';

export abstract class MutationCreator {
  public abstract factoryMethod(): Mutation;
}

export abstract class QueryCreator {
  public abstract factoryMethod(): Query;
}
