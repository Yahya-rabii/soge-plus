import { Address } from "./address.model";
import { Credential } from "./credential.model";


export class Transaction {

    id!: number | 0;
    transactionDate!: Date;
    senderId!: string | '';
    ReceiverId!: string | '';
    amount!: number | 0;

   
    


    // constructor AND GETTERS AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES

    constructor(
        id ?: number,
        transactionDate?: string,
        senderId?: string,
        ReceiverId?: string,
        amount?: number,
    ) {
        this.id = id || 0;
        this.senderId = senderId || '';
        this.ReceiverId = ReceiverId || '';
        this.amount = amount || 0;
    }

    public get_attributes(): string {
        return this.transactionDate + ' ' + this.senderId + ' ' + this.ReceiverId + ' ' + this.amount;
    }


    public set_attributes(transactionDate: Date, senderId: string, ReceiverId: string, amount: number, bankName: string): void {
        this.transactionDate = transactionDate;
        this.senderId = senderId;
        this.ReceiverId = ReceiverId;
        this.amount = amount;
    }
  
    public get_id(): number {
        return this.id;
    }


    public get_transactionDate(): Date {
        return this.transactionDate 
    }


    public get_senderId(): string {
        return this.senderId;
    }


    public get_ReceiverId(): string {
        return this.ReceiverId;
    }


    public get_amount(): number {
        return this.amount;
    }

    

   



    public set_id(id: number): void {
        this.id = id;
    }



    public set_transactionDate(transactionDate: Date): void {
        this.transactionDate = transactionDate;
    } 


    public set_senderId(senderId: string): void {
        this.senderId = senderId;
    }


    public set_ReceiverId(ReceiverId: string): void {
        this.ReceiverId = ReceiverId;
    }


    public set_amount(amount: number): void {
        this.amount = amount;
    }







}