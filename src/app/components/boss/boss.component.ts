import { Component, Input, OnInit } from '@angular/core';
import { IBoss } from 'src/app/interfaces/boss';
import { Element } from 'src/app/interfaces/element';
import { Type } from 'src/app/interfaces/type';
import { Option } from 'src/app/util';

@Component({
  selector: 'app-boss',
  templateUrl: './boss.component.html',
  styleUrls: ['./boss.component.css']
})
export class BossComponent implements OnInit {
  Element = Element;
  Type = Type;
  
  @Input() boss: IBoss;
  
  weaknesses: Option<Element>[] = Object.keys(Element)
    .map((x) => Element[x])
    .filter((x) => typeof x === "string" && Element[x] !== Element.Undefined)
    .map((x: string) => ({ label: x, value: Element[x] }));

  types: Option<Type>[] = Object.keys(Type)
    .map((x) => Type[x])
    .filter((x) => typeof x === "string" && Type[x] !== Type.Undefined)
    .map((x: string) => ({ label: x, value: Type[x] }));


  constructor() { }

  ngOnInit(): void {
  }


}
