import { Pipe, PipeTransform } from "@angular/core";

@Pipe({name: "floor"})
export class FloorPipe implements PipeTransform{
    transform(value: number) {
        return Math.round((value + Number.EPSILON) * 10) / 10 
    }
}