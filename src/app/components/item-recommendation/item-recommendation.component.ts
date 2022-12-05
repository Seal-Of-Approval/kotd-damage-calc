import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { IBoss } from 'src/app/interfaces/boss';
import { Element } from 'src/app/interfaces/element';
import { IWeapon } from 'src/app/interfaces/item';
import { Weapons } from 'src/app/items';
import { getTypeData, typeToIcon } from 'src/app/util';

@Component({
  selector: 'app-item-recommendation',
  templateUrl: './item-recommendation.component.html',
  styleUrls: ['./item-recommendation.component.css']
})
export class ItemRecommendationComponent implements OnInit {
  Element = Element;
  typeToIcon = typeToIcon;

  constructor() { }

  ngOnInit(): void {
  }

  @Input() boss: IBoss;
  @Output() selectRecommendation = new EventEmitter<IWeapon>();


  get selectedRecommendation(){
    return this.#selectedRecommendation;
  }

  set selectedRecommendation(value: IWeapon){
    this.#selectedRecommendation = value
    this.selectRecommendation.emit(value);
  }
  #selectedRecommendation: IWeapon;

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
