import { MethodPayment } from './MethodPayment';

export interface ExpectedCharges {
    from: MethodPayment;
    amount: number;
    debitDate: string;
}