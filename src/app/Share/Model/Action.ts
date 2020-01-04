import { displayDate } from '../Functions/DisplayDate';
import { MethodPayment } from './MethodPayment';
import { Category } from './Category';
import { User } from './User';

export class Action {
    id: number;
    actionType: string;
    title: string;
    amount: number;
    actionDate: string;
    debitDate: Date;
    category: Category;
    user: User;
    methodPayment: MethodPayment;

    constructor(){
        this.actionDate =  displayDate(new Date());
    }

}