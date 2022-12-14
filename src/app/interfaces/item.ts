import { Element } from './element';
import { Type } from './type';

export interface IItem {
  ID: number;
  name: string;
}

export interface IWeapon extends IItem {
  minDamage?: number;
  maxDamage?: number;
  averageDamage?: number;
  element: Element;
  type: Type;
  level: number;
}

export interface IPotion extends IItem {}
