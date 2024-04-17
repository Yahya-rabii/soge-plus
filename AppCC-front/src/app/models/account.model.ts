import { Address } from "./address.model";
import { Credential } from "./credential.model";


export class Account {

    id !: number | 0;
    accountHolderRIB!: string | '';
    // accountType of accountType enum accountType {PERSONAL, MORTGAGE, AUTO, STUDENT}
    accountType!: string | '';
    // payement duration of accountType enum Duration {MONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY}
    accountHolderId!: string | '';
    balance!: number | 0;

    // receptionMethod of accountType enum ReceptionMethod {ONLINE, ON_AGENCY}
   
    // beneficiariesIds of type string[]
    beneficiariesIds!: string[] | [];


    // constructor AND GETTERS AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES

    constructor(
        id ?: number,
        accountHolderRIB?: string,
        accountType?: string,
        accountHolderId?: string,
        balance?: number,

        beneficiariesIds?: string[]
    ) {
        this.id = id || 0;
        this.accountHolderRIB = accountHolderRIB || '';
        this.accountType = accountType || '';
        this.accountHolderId = accountHolderId || '';
        this.balance = balance || 0;

        this.beneficiariesIds = beneficiariesIds || [];
    }

    public get_attributes(): string {
        return this.accountHolderRIB + ' ' + this.accountType + ' ' + this.accountHolderId + ' ' + this.balance;
    }


    public set_attributes(accountHolderRIB: string, accountType: string, accountHolderId: string, balance: number, bankName: string, beneficiariesIds: string[]): void {
        this.accountHolderRIB = accountHolderRIB;
        this.accountType = accountType;
        this.accountHolderId = accountHolderId;
        this.balance = balance;
        this.beneficiariesIds = beneficiariesIds;
    }
  
    public get_id(): number {
        return this.id;
    }


    public get_accountHolderRIB(): string {
        return this.accountHolderRIB;
    }


    public get_accountType(): string {
        return this.accountType;
    }


    public get_accountHolderId(): string {
        return this.accountHolderId;
    }


    public get_balance(): number {
        return this.balance;
    }

   
 
    public get_beneficiariesIds(): string[] {
        return this.beneficiariesIds;
    }


    public set_id(id: number): void {
        this.id = id;
    }



    public set_accountHolderRIB(accountHolderRIB: string): void {
        this.accountHolderRIB = accountHolderRIB;
    } 


    public set_accountType(accountType: string): void {
        this.accountType = accountType;
    }


    public set_accountHolderId(accountHolderId: string): void {
        this.accountHolderId = accountHolderId;
    }


    public set_balance(balance: number): void {
        this.balance = balance;
    }





    public set_beneficiariesIds(beneficiariesIds: string[]): void {
        this.beneficiariesIds = beneficiariesIds;
    }




}