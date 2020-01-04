import { Division } from './Division';

export class Row {
    category: string;
    actionType: string;
    amount: number;
    avg: number;
    division: Division[];

    constructor(){
        this.amount = 0;
    }

    
}