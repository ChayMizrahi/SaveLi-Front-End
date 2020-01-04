import { Action } from '../Model/Action';


export function sortActionsByActionDate(actions:Action[]){
    actions.sort((a,b)=>{
        let aDate:Date = new Date(a.actionDate);
        let bDate:Date = new Date(b.actionDate);
        return aDate.getTime()-bDate.getTime();
    })
}

export function sortActionsByDebitDate(actions:Action[]){
    actions.sort((a,b)=>{
        let aDate:Date = new Date(a.debitDate);
        let bDate:Date = new Date(b.debitDate);
        return aDate.getTime()-bDate.getTime();
    })
}

export function sortActionsByAmount(actions:Action[]){
    actions.sort((a,b)=>{
        return b.amount-a.amount;
    })
}

export function sortActionsByTitle(actions:Action[]){
    actions.sort((a,b)=>{
        if(a.title > b.title){
            return 1;
        } else if (b.title >a.title){
            return -1;
        }else{
            return 0
        }
    })
}

export function sortActionsByCategory(actions:Action[]){
    actions.sort((a,b)=>{
        if(a.category > b.category){
            return 1;
        } else if (b.category >a.category){
            return -1;
        }else{
            return 0
        }
    })
}