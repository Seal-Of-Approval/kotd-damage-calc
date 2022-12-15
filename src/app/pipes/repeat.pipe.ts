import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "repeat"})
export class RepeatPipe implements PipeTransform{
    transform(value: string, amount:number) {
        return value.repeat(amount);
    }
}