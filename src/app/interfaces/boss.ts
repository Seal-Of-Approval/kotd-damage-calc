import { Type } from './type';
import { Element } from './element';

export interface IBoss {
  ID: string;
  name?: string;
  health?: number;
  maxHealth?: number;
  level?: number;
  weaknesses: Element[];
  resists: Element[];
  type: Type;
}
