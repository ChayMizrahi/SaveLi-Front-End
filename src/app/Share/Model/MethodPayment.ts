import { Action } from './Action';

export class MethodPayment {
    id: number;
    name: string;
    debitDate: number;
    active: boolean;
    actions:Action[];

    constructor(){
        this.active = true;
    }
}