import { Row } from './Row';
import { User } from './User';

export class BalanceTable {
   
    expenses: Row[];
    totalExpense: Row;
    incomes: Row[];
    totalIncome: Row;
    userWithActions: User[];

    constructor(){
        this.expenses = [];
    }
    
}