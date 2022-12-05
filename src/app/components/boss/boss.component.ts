import { Component, Input, OnInit } from '@angular/core';
import { IBoss } from 'src/app/interfaces/boss';
import { Element } from 'src/app/interfaces/element';
import { Type } from 'src/app/interfaces/type';
import { Option } from 'src/app/util';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IRedditPost } from 'src/app/interfaces/reddit';
import { MessageService } from 'primeng/api';
// import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-boss',
  templateUrl: './boss.component.html',
  styleUrls: ['./boss.component.css']
})
export class BossComponent implements OnInit {
  Element = Element;
  Type = Type;
  
  fetching = false;

  @Input() boss: IBoss;
  
  weaknesses: Option<Element>[] = Object.keys(Element)
    .map((x) => Element[x])
    .filter((x) => typeof x === "string" && Element[x] !== Element.Undefined)
    .map((x: string) => ({ label: x, value: Element[x] }));

  types: Option<Type>[] = Object.keys(Type)
    .map((x) => Type[x])
    .filter((x) => typeof x === "string" && Type[x] !== Type.Undefined)
    .map((x: string) => ({ label: x, value: Type[x] }));


  constructor(private http: HttpClient, private messageService: MessageService) { }

  ngOnInit(): void {
  }

  async fetchBoss(id: string){
    id = id?.trim() ?? "";
    if(id === "")
      return;
    try {
      this.fetching = true;
      const url = `https://proxy.cors.sh/https://reddit.com/${id}/.json?raw_json=1`;
      const data: IRedditPost = <IRedditPost>await lastValueFrom(this.http.get(url));
      const elements = this.extractElements(data);
      const boss: IBoss = this.boss;
      boss.weaknesses = elements.weaknesses;
      boss.resists = elements.resistances;      
      this.messageService.add({severity: "success", summary:"Fetched boss", detail: "Elements updated"});
    } catch (error) {
      this.messageService.add({severity: "error", summary:"Error fetching boss with that ID.", detail: JSON.stringify(error)});
      console.error(error)
    }finally{
      this.fetching = false;
    }
  }

  extractElements(data: IRedditPost){
    const text = JSON.stringify(data); // lazy regex 
    const weaknessRE = /(?<Weakness>\w*(?=\sWeakness))/;
    const resistanceRE = /(?<Resistance>\w*(?=\sResistance))/
    const weaknesses =  [...new Set(weaknessRE.exec(text)?.map(x => Element[x]).filter(x => x))];
    const resistances = [...new Set(resistanceRE.exec(text)?.map(x => Element[x]).filter(x => x))];
    return {weaknesses, resistances}
  }
}
