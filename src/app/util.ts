import { Weapons } from './items';
import { Type } from './interfaces/type';
import { IWeapon } from './interfaces/item';
import { Loadout } from './interfaces/raid';
import { IBoss } from './interfaces/boss';

export const averageBaseDamage = 3.5;


export type Option<T> = {
  label: string;
  value: T;
};
export function toWeapon(id: number | string) {
  return Weapons.find((x) => x.ID === Number(id));
}

export function typeToIcon(type: Type) {
  switch (type) {
    case Type.Melee:
      return '⚔️';
    case Type.Ranged:
      return '🏹';
    case Type.Magic:
      return '🔮';
  }
}

/**
 *                   | Type Resist | Type Neutral | Type Weak
 *  Element Resist   | 30% - 60%   | 40% - 70%    | 50% - 80%
 *  Element Neutral  | 90%         | 100%         | 110%
 *  Element Weak     | 100% - 190% | 110% - 200%  | 120% - 210%
 */
export function getDamageModifier(element: number, type: number) {
  let modifier = 1;
  if (type < 0) modifier -= 0.1;
  else if (type > 0) modifier += 0.1;
  if (element < 0) modifier -= 0.45;
  else if (element > 0) modifier += 0.55;
  return modifier;
}

export function getTypeData(type: Type) {
  switch (type) {
    case Type.Melee:
      return { strong: Type.Ranged, weak: Type.Magic };
    case Type.Ranged:
      return { strong: Type.Magic, weak: Type.Melee };
    case Type.Magic:
      return { strong: Type.Melee, weak: Type.Ranged };
  }
}


export function calculateDamage(loadout: Loadout, averageLevel: number, boss: IBoss) {
  return Object.entries(loadout).reduce((curr, entry) => {
    const [key, val] = entry;
    const weapon = toWeapon(key);
    const element = boss.weaknesses.includes(weapon.element)
      ? 1
      : boss.resists.includes(weapon.element)
      ? -1
      : 0;
    const typeData = getTypeData(boss.type);
    const type =
      typeData.weak === weapon.type
        ? 1
        : typeData.strong === weapon.type
        ? -1
        : 0;
    return (curr + val * getWeaponDamage(weapon, averageLevel, boss));
  }, 0);
}

export function getWeaponDamage(weapon: IWeapon, averageLevel: number, boss: IBoss){
  const element = boss.weaknesses.includes(weapon.element)
      ? 1
      : boss.resists.includes(weapon.element)
      ? -1
      : 0;
    const typeData = getTypeData(boss.type);
    const type =
      typeData.weak === weapon.type
        ? 1
        : typeData.strong === weapon.type
        ? -1
        : 0;
    return (averageBaseDamage +
      calculateLevelDamage(averageLevel) +
      weapon.averageDamage * getDamageModifier(element, type))
}

export function calculateLevelDamage(level: number) {
  // old formula 0.1 + 0.5 * (0.25 * level);
  // new formula for average between .1 to .25 
  return .175 * level
}