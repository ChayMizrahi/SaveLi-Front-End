export class Category {
    id: number;
    name: string;
    description: string;
    type: string;
    active: boolean;
    usedTotal:number;

    constructor(){
        this.active = true;
        this.usedTotal = 0;
    }
}