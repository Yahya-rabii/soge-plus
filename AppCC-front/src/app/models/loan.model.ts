import { Address } from "./address.model";
import { Credential } from "./credential.model";


export class Loan {

    id !: number | 0;
    amount!: number | 0;
    // type of type enum Type {PERSONAL, MORTGAGE, AUTO, STUDENT}
    type!: string | '';
    // payement duration of type enum Duration {MONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY}
    paymentDuration!: string | '';
    // status of type enum Status {PENDING, APPROVED, REJECTED}
    status!: string | 'PENDING';
    approuved!: boolean | false;
    signature: File | null = null;
    cinCartFont: File | null = null;
    cinCartBack: File | null = null;
    cinNumber!: string | '';
    taxId!: string | '';
    // receptionMethod of type enum ReceptionMethod {ONLINE, ON_AGENCY}
    receptionMethod!: string | '';
    //bankAccountCredentials RIB
    bankAccountCredentials_RIB!: string | '';
    // selectedAgency
    selectedAgency!: string | '';

    // Date of loan creation in dd/mm/yyyy/hh/mm/ss format
    
    loanCreationDate!: Date | Date;

    clientId!: string | '';


    // constructor AND GETTERS AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES

    constructor(
        id ?: number,
        amount?: number,
        type?: string,
        paymentDuration?: string,
        status? : string | 'PENDING',
        approuved?: boolean | false,
        signature?: File,
        cinCartFont?: File,
        cinCartBack?: File,
        cinNumber?: string,
        taxId?: string,
        receptionMethod?: string,
        bankAccountCredentials_RIB?: string,
        selectedAgency?: string,
        loanCreationDate?: Date,
        clientId?: string
    ) {
        this.id = id || 0;
        this.amount = amount || 0;
        this.type = type || '';
        this.paymentDuration = paymentDuration || '';
        this.status = status || 'PENDING';
        this.approuved = approuved || false;
        this.signature = signature || null;
        this.cinCartFont = cinCartFont || null;
        this.cinCartBack = cinCartBack || null;
        this.cinNumber = cinNumber || '';
        this.taxId = taxId || '';
        this.receptionMethod = receptionMethod || '';
        this.bankAccountCredentials_RIB = bankAccountCredentials_RIB || '';
        this.selectedAgency = selectedAgency || '';
        this.loanCreationDate = loanCreationDate || new Date();
        this.clientId = clientId || '';
    }

    public get_attributes(): string {
        return  this.amount + ' ' + this.type + ' ' + this.paymentDuration + ' ' + this.status + ' ' + this.approuved + ' ' + this.signature + ' ' + this.cinCartFont + ' ' + this.cinCartBack + ' ' + this.cinNumber + ' ' + this.taxId + ' ' + this.receptionMethod + ' ' + this.bankAccountCredentials_RIB + ' ' + this.selectedAgency + ' ' + this.loanCreationDate + ' ' + this.clientId;
    }


    public set_attributes(id :number ,amount: number, type: string, paymentDuration: string, status: string, approuved: boolean, signature: File, cinCartFont: File, cinCartBack: File, cinNumber: string, taxId: string, receptionMethod: string, bankAccountCredentials_RIB: string, selectedAgency: string, loanCreationDate: Date, clientId: string): void {
        this.id = id;
        this.amount = amount;
        this.type = type;
        this.paymentDuration = paymentDuration;
        this.status = status;
        this.approuved = approuved;
        this.signature = signature;
        this.cinCartFont = cinCartFont;
        this.cinCartBack = cinCartBack;
        this.cinNumber = cinNumber;
        this.taxId = taxId;
        this.receptionMethod = receptionMethod;
        this.bankAccountCredentials_RIB = bankAccountCredentials_RIB;
        this.selectedAgency = selectedAgency;
        this.loanCreationDate = loanCreationDate;
        this.clientId = clientId;
    }
  
    public get_id(): number {
        return this.id;
    }


    public get_amount(): number {
        return this.amount;
    }


    public get_type(): string {
        return this.type;
    }


    public get_paymentDuration(): string {
        return this.paymentDuration;
    }


    public get_status(): string {
        return this.status;
    }


    public get_signature(): File | null {
        return this.signature;
    }


    public get_cinCartFont(): File | null{
        return this.cinCartFont;
    }


    public get_cinCartBack(): File | null{
        return this.cinCartBack;
    }


    public get_cinNumber(): string {
        return this.cinNumber;
    }


    public get_taxId(): string {
        return this.taxId;
    }


    public get_receptionMethod(): string {
        return this.receptionMethod;
    }



    public get_bankAccountCredentials_RIB(): string {
        return this.bankAccountCredentials_RIB;
    }


    public get_selectedAgency(): string {
        return this.selectedAgency;
    }



    public get_loanCreationDate(): Date {
        return this.loanCreationDate;
    }


    public get_clientId(): string {
        return this.clientId;
    }




    public set_amount(amount: number): void {
        this.amount = amount;
    }


    public set_type(type: string): void {
        this.type = type;
    }


    public set_paymentDuration(paymentDuration: string): void {
        this.paymentDuration = paymentDuration;
    }


    public set_status(status: string): void {
        this.status = status;
    }


    public set_approuved(approuved: boolean): void {
        this.approuved = approuved;
    }


    public set_signature(signature: File): void {
        this.signature = signature;
    }


    public set_cinCartFont(cinCartFont: File): void {
        this.cinCartFont = cinCartFont;
    }


    public set_cinCartBack(cinCartBack: File): void {
        this.cinCartBack = cinCartBack;
    }


    public set_cinNumber(cinNumber: string): void {
        this.cinNumber = cinNumber;
    }


    public set_taxId(taxId: string): void {
        this.taxId = taxId;
    }



    public set_receptionMethod(receptionMethod: string): void {
        this.receptionMethod = receptionMethod;
    }



    public set_bankAccountCredentials_RIB(bankAccountCredentials_RIB: string): void {
        this.bankAccountCredentials_RIB = bankAccountCredentials_RIB;
    }


    public set_selectedAgency(selectedAgency: string): void {
        this.selectedAgency = selectedAgency;
    }


    public set_loanCreationDate(loanCreationDate: Date): void {
        this.loanCreationDate = loanCreationDate;
    }


    public set_clientId(clientId: string): void {
        this.clientId = clientId;
    }





}