import { Query } from '../../video.interface';
import { QueryCreator } from '../Factory';
import TokenQuery from '../queries/TokenQuery';

export default class TokenQueryCreator extends QueryCreator {
  public factoryMethod(): Query {
    return new TokenQuery();
  }
}
