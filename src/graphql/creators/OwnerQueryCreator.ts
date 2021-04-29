import { Query } from '../../video.interface';
import { QueryCreator } from '../Factory';
import OwnerQuery from '../queries/OwnerQuery';

export default class OwnerQueryCreator extends QueryCreator {
  public factoryMethod(): Query {
    return new OwnerQuery();
  }
}
