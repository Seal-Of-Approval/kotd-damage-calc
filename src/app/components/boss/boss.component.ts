import { Component, Input, OnInit } from '@angular/core';
import { IBoss } from 'src/app/interfaces/boss';
import { Element } from 'src/app/interfaces/element';
import { Type } from 'src/app/interfaces/type';
import { maxDamage, Option, elementToIcon } from 'src/app/util';
import { HttpClient } from '@angular/common/http';
import { lastValueFrom } from 'rxjs';
import { IComment, IRedditPost } from 'src/app/interfaces/reddit';
import { MessageService } from 'primeng/api';
import { Router, ActivatedRoute } from '@angular/router';
import { Meta } from '@angular/platform-browser';
// import { MessageService } from 'primeng/api';
@Component({
  selector: 'app-boss',
  templateUrl: './boss.component.html',
  styleUrls: ['./boss.component.css']
})
export class BossComponent implements OnInit {
  Element = Element;
  Type = Type;
  maxDamage = maxDamage
  fetching = false;

  @Input() set boss(value: IBoss) {
    const previous = this.#boss;
    this.#boss = value;
    if(previous?.ID !== this.#boss.ID)
      this.fetchBoss(this.#boss.ID).catch(console.error)
  }
  get boss(): IBoss {
    return this.#boss;
  }
  #boss: IBoss;
  
  weaknesses: Option<Element>[] = Object.keys(Element)
    .map((x) => Element[x])
    .filter((x) => typeof x === "string" && Element[x] !== Element.Undefined)
    .map((x: string) => ({ label: x, value: Element[x] }));

  types: Option<Type>[] = Object.keys(Type)
    .map((x) => Type[x])
    .filter((x) => typeof x === "string" && Type[x] !== Type.Undefined)
    .map((x: string) => ({ label: x, value: Type[x] }));


  constructor(
    private http: HttpClient, 
    private messageService: MessageService,
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private metaService: Meta) { }

  ngOnInit(): void {
  }

  async fetchBoss(id: string){
    id = id?.trim() ?? "";
    if(id === "")
      return;
    const idRegex = /kickopenthedoor\/(?:comments\/)?([a-zA-Z0-9]*)/i
    const result = id.match(idRegex);
    if(result?.length === 2)
      id = result[1];
      
    try {
      this.fetching = true;
      const url = `https://api.reddit.com/${id}/.json?raw_json=1`;
      const data: IRedditPost = <IRedditPost>await lastValueFrom(this.http.get(url));
      const tmp = this.extractBoss(data)
      this.boss = tmp;
      this.messageService.add({severity: "success", summary:"Fetched boss", detail: "Elements updated"});
      this.metaService.updateTag({property: "og:title", content: this.#boss.name})
      this.metaService.updateTag({property: "og:description", content: `Weak to: ${[Type[this.boss.type], ...this.#boss.weaknesses.map(x => Element[x])].filter(x => x).join(', ')}`})
      this.metaService.updateTag({property: "og:url", content: `//reddit.com/${this.#boss.ID}`})
      this.router.navigate(
        [], 
        {
          relativeTo: this.activatedRoute,
          queryParams: {boss: id}, 
          queryParamsHandling: 'merge',
        });
    } catch (error) {
      this.messageService.add({severity: "error", summary:"Error fetching boss with that ID.", detail: JSON.stringify(error)});
      console.error(error)
    }finally{
      this.fetching = false;
    }
  }

  extractBoss(data: IRedditPost): IBoss{
    const flair = data[0].data.children[0].data.link_flair_text; 
    const health = this.getHealth(flair);
    const elements = this.extractElements(data);
    return {
      ID: data[0].data.children[0].data.id,
      name: data[0].data.children[0].data.title.split('[').shift()?.trim(),
      level: flair.split("★").length - 1,
      ...health,
      resists: elements.resistances,
      weaknesses: elements.weaknesses,
      type: this.getType(flair)
    }
  }

  extractElements(data: IRedditPost){
    const weaknessRE = /(?<Weakness>\w*(?=\sWeakness))/g;
    const resistanceRE = /(?<Resistance>\w*(?=\sResistance))/g;
    const botComments = this.flattenComments(data).filter(x => x.author === "KickOpenTheDoorBot");
    const elements = botComments.map(x => {
      return ({
        weakness: x.body.match(weaknessRE)?.shift(),
        resistance: x.body.match(resistanceRE)?.shift()
      })
    });
    const weaknesses =  [...new Set(elements.map(x => Element[x.weakness]).filter(x => x))];
    const resistances =  [...new Set(elements.map(x => Element[x.resistance]).filter(x => x))];
    return {weaknesses, resistances}
  }

  private flattenComments(data: IRedditPost): IComment[] {
    const comments = data[1].data.children.map( x => getReplies(x.data)).flat();
    return comments;
    function getReplies(c: IComment): IComment[]{
      if(!c.replies)
        return [c]
      const replies: IComment[] = [];
      c.replies.data.children.forEach(x => {
        replies.push(x.data);
        replies.push(...getReplies(x.data))
      });
      return replies;
    }
  }

  private getType(flair: string) {
    if(flair.indexOf('⚔️') >= 0)
      return Type.Melee
    if(flair.indexOf('🏹') >= 0)
      return Type.Ranged
    if(flair.indexOf('🔮') >= 0)
      return Type.Magic
  }
  private getHealth(flair: string) {
    flair = flair.replace('[', '').replace(']', '');
    const parts = flair.split('❤️:');
    if(parts.length < 2)
      return {health: 0, maxHealth: 0};
    const numbers = parts[1].split('/')
    if(numbers.length < 2)
      return {health: 0, maxHealth: 0};
    return {health: Number(numbers[0]), maxHealth: Number(numbers[1])}
  }

  public async copy(){
    try {
      await navigator.clipboard.writeText(`
@NOTIFY GATHER for **${this.boss.name}

**Level**:\t\t${this.boss.level} 
**HP**: \t\t\t**${this.boss.health}**/${this.boss.maxHealth}
**Damage**: \t${Math.floor(this.maxDamage(this.boss))}
**DMG**: \t\tXX

**Weakness**: \t${this.boss.weaknesses.map(x => elementToIcon(x)).join(' ')}
**Resist**: \t\t${this.boss.resists.map(x => elementToIcon(x)).join(' ')}

https://reddit.com/${this.boss.ID}
`);

      this.messageService.add({severity: "success", summary:"Copied boss to clipboard"});
    } catch (error) {
      this.messageService.add({severity: "error", summary:"Error copying to clipboard", detail: error.msg ?? error});
    }

  }
}
