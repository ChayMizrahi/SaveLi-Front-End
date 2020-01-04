import { Action } from './Action';
import { THROW_IF_NOT_FOUND } from '@angular/core/src/di/injector';

export class ActionByYearAndMonth{
    private year:number;
    private month:number;
    private actions:Action[];

    constructor(){
        this.actions = [];
    }

    setYear(year:number){
        this.year = year;
    }

    getYear():number{
        return this.year;
    }

    setMonth(month:number){
        this.month = month;
    }

    getMonth():number{
        return this.month;
    }

    addAction(action:Action){
        this.actions.push(action);
    }

    getActions():Action[]{
        return this.actions
    }

}