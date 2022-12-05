import { Component, VERSION } from "@angular/core";
import { Weapons } from "./items";
import { IBoss } from "./interfaces/boss";
import { Element } from "./interfaces/element";
import { IWeapon } from "./interfaces/item";
import { Loadout } from "./interfaces/raid";
import { Type } from "./interfaces/type";
import {
  calculateDamage,
  getDamageModifier,
  getTypeData,
  Option,
  toWeapon,
  typeToIcon,
} from "./util";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  Element = Element;
  typeToIcon = typeToIcon;
  averageLevel = 15;
  display = false;

  get damage() {
    const dmg = calculateDamage(this.loadout, this.averageLevel, this.boss);
    return Math.round((dmg + Number.EPSILON) * 10) / 10;
  }

  boss: IBoss = {
    ID: undefined,
    name: "",
    weaknesses: [],
    resists: [],
    type: Type.Undefined,
  };

  loadout: Loadout = {};

  selectedRecommendation(value: IWeapon) {
    this.loadout[value.ID] ??= 1;
    this.loadout = {...this.loadout}
  }

  reset(){
    this.loadout = {};
    this.boss = {
      ID: undefined,
      name: "",
      weaknesses: [],
      resists: [],
      type: Type.Undefined,
    };
  }
}
