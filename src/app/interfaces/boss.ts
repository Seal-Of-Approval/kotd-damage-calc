import { Type } from './type';
import { Element } from './element';

export interface IBoss {
  ID: string;
  name?: string;
  weaknesses: Element[];
  resists: Element[];
  type: Type;
}
