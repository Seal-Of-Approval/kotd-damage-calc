import { Component, VERSION } from '@angular/core';
import { Weapons } from './items';
import { IBoss } from './interfaces/boss';
import { Element } from './interfaces/element';
import { IWeapon } from './interfaces/item';
import { Loadout } from './interfaces/raid';
import { Type } from './interfaces/type';
import {
  getDamageModifier,
  getTypeData,
  Option,
  toWeapon,
  typeToIcon,
} from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  Element = Element
  typeToIcon = typeToIcon;
  toWeapon = toWeapon;
  averageBaseDamage = 3.5;
  averageLevel = 15;
  display = false;

  get result() {
    return this.#result;
  }
  set result(value: IWeapon[]) {
    console.log(value);
    this.#result = value;
    this.setLoadout(value);
  }

  get damage() {
    const dmg = this.calculateDamage(this.loadout);
    return Math.round((dmg + Number.EPSILON) * 10) / 10;
  }

  #result;
  weaknesses: Option<Element>[] = Object.keys(Element)
    .map((x) => Element[x])
    .filter((x) => typeof x === 'string' && Element[x] !== Element.Undefined)
    .map((x: string) => ({ label: x, value: Element[x] }));

  types: Option<Type>[] = Object.keys(Type)
    .map((x) => Type[x])
    .filter((x) => typeof x === 'string' && Type[x] !== Type.Undefined)
    .map((x: string) => ({ label: x, value: Type[x] }));
  suggestions = [];
  boss: IBoss = {
    ID: undefined,
    name: '',
    weaknesses: [],
    resists: [],
    type: Type.Undefined,
  };

  loadout: Loadout = {};

  search(event) {
    const inLoadout = Object.keys(this.loadout);
    this.suggestions = Weapons.filter(
      (x) =>
        !inLoadout.includes(x.ID.toString()) &&
        (x.ID === Number(event.query) ||
          x.name.toLowerCase().indexOf(event.query) >= 0)
    );
  }

  setLoadout(value: IWeapon[]) {
    const keys = Object.keys(this.loadout);
    const itemIDs = value.map((x) => x.ID);
    const toDelete = keys.filter((x) => !itemIDs.includes(Number(x)));
    toDelete.forEach((x) => delete this.loadout[x]);
    value.forEach((x) => (this.loadout[x.ID] ??= 1));
  }

  calculateDamage(loadout: Loadout) {
    return Object.entries(loadout).reduce((curr, entry) => {
      const [key, val] = entry;
      const weapon = toWeapon(key);
      const element = this.boss.weaknesses.includes(weapon.element)
        ? 1
        : this.boss.resists.includes(weapon.element)
        ? -1
        : 0;
      const typeData = getTypeData(this.boss.type);
      const type =
        typeData.weak === weapon.type
          ? 1
          : typeData.strong === weapon.type
          ? -1
          : 0;
      return (
        curr +
        val *
          (this.averageBaseDamage +
            this.calculateLevelDamage(weapon, this.averageLevel) +
            weapon.averageDamage * getDamageModifier(element, type))
      );
    }, 0);
  }

  calculateLevelDamage(weapon: IWeapon, level: number) {
    if (weapon.ID === 0) return 0;
    return 0.1 + 0.5 * (0.25 * level);
  }

  get weaponRecommendations() {
    const typeData = getTypeData(this.boss.type);
    const element = Weapons.filter((x) =>
      this.boss.weaknesses.includes(x.element)
    ).sort(this.weaponSort.bind(this));
    const type = Weapons.filter(
      (x) =>
        typeData &&
        x.type === typeData.weak &&
        !this.boss.resists.includes(x.element)
    ).sort(this.weaponSort.bind(this));
    return element.concat(...type);
  }

  private weaponSort(a: IWeapon, b: IWeapon): number {
    if (this.boss.weaknesses.includes(a.element)) {
      if (!this.boss.weaknesses.includes(b.element)) return -1;
    } else {
      if (this.boss.weaknesses.includes(b.element)) return 1;
    }
    return a.averageDamage > b.averageDamage
      ? -1
      : a.averageDamage < b.averageDamage
      ? 1
      : 0;
  }
}
