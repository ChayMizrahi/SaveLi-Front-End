import { User } from './User';
import { MethodPayment } from './MethodPayment';

export class Customer {
    id: number;
    email: string;
    password: string;
    methodPayments: MethodPayment[];
    users: User[];

    constructor() {
        this.users = [];
        this.methodPayments = [];
    }
}