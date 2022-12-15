import { Component, OnInit, VERSION } from "@angular/core";
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
export class AppComponent implements OnInit {
  Element = Element;
  typeToIcon = typeToIcon;
  #averageLevel = 15;
  get averageLevel() {
    return this.#averageLevel;
  }
  set averageLevel(value) {
    this.#averageLevel = value;
    localStorage.setItem('averageLevel', value.toString())
  }
  #maxLevel = 45;
  get maxLevel() {
    return this.#maxLevel;
  }
  set maxLevel(value) {
    this.#maxLevel = value;
    localStorage.setItem('maxLevel', value.toString())
  }
  display = false;
  
  get damage() {
    return calculateDamage(this.loadout, this.averageLevel, this.boss);
  }
  
  boss: IBoss = {
    ID: undefined,
    name: "",
    weaknesses: [],
    resists: [],
    type: Type.Undefined,
  };
  
  loadout: Loadout = {};

  ngOnInit(): void {
    this.averageLevel = Number(localStorage.getItem("averageLevel") ?? '15');
    this.maxLevel = Number(localStorage.getItem("maxLevel") ?? '45')
  }

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
