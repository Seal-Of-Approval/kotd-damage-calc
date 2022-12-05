import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IWeapon } from 'src/app/interfaces/item';
import { Loadout } from 'src/app/interfaces/raid';
import { Weapons } from 'src/app/items';
import { toWeapon, typeToIcon } from 'src/app/util';

@Component({
  selector: 'app-loadout',
  templateUrl: './loadout.component.html',
  styleUrls: ['./loadout.component.css']
})
export class LoadoutComponent implements OnInit {
  toWeapon = toWeapon;
  typeToIcon = typeToIcon;

  @Input() set loadout (value: Loadout){
    this.#loadout = value;
    this.#result = Object.keys(this.#loadout).map(x => toWeapon(x))
  }
  get loadout(){
    return this.#loadout;
  }
  #loadout: Loadout;
  
  @Input() set averageLevel(value:number){
    if(value != this.#averageLevel)
      this.averageLevelChange.emit(value);
    this.#averageLevel = value;
  }
  get averageLevel() {
    return this.#averageLevel;
  }
  #averageLevel: number;
  @Output() averageLevelChange = new EventEmitter<number>();
  suggestions: IWeapon[] = []
  get result() {
    return this.#result;
  }

  set result(value: IWeapon[]) {
    this.#result = value;
    this.setLoadout(value);
  }
  #result;

  constructor() { }

  ngOnInit(): void {
  }

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

}
