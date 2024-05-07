export class Account {

    id !: number | 0;
    accountHolderRib!: string | '';
    // accountType of accountType enum accountType {PERSONAL, MORTGAGE, AUTO, STUDENT}
    accountType!: string | '';
    // payement duration of accountType enum Duration {MONTHLY, QUARTERLY, SEMIANNUALLY, ANNUALLY}
    accountHolderId!: string | '';
    balance!: number | 0;
    cardId!: number | 0;

    // receptionMethod of accountType enum ReceptionMethod {ONLINE, ON_AGENCY}
   
    // beneficiariesIds of type string[]
    beneficiariesIds!: string[] | [];


    // constructor AND GETTERS AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES

    constructor(
        id ?: number,
        accountHolderRib?: string,
        accountType?: string,
        accountHolderId?: string,
        balance?: number,
        cardId?: number,

        beneficiariesIds?: string[]
    ) {
        this.id = id || 0;
        this.accountHolderRib = accountHolderRib || '';
        this.accountType = accountType || '';
        this.accountHolderId = accountHolderId || '';
        this.balance = balance || 0;

        // if the cardId is less that 10 we add a 0 before the number

        this.cardId = cardId || 0;



        this.beneficiariesIds = beneficiariesIds || [];
    }

    public get_attributes(): string {
        return this.accountHolderRib + ' ' + this.accountType + ' ' + this.accountHolderId + ' ' + this.balance;
    }


    public set_attributes(accountHolderRib: string, accountType: string, accountHolderId: string, balance: number, bankName: string, beneficiariesIds: string[]): void {
        this.accountHolderRib = accountHolderRib;
        this.accountType = accountType;
        this.accountHolderId = accountHolderId;
        this.balance = balance;
        this.beneficiariesIds = beneficiariesIds;
    }
  
    public get_id(): number {
        return this.id;
    }


    public get_accountHolderRib(): string {
        return this.accountHolderRib;
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

    public get_cardId(): number {
        return this.cardId;
    }


   
 
    public get_beneficiariesIds(): string[] {
        return this.beneficiariesIds;
    }


    public set_id(id: number): void {
        this.id = id;
    }



    public set_accountHolderRib(accountHolderRib: string): void {
        this.accountHolderRib = accountHolderRib;
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

    public set_cardId(cardId: number): void {
        this.cardId = cardId;
    }

    



    public set_beneficiariesIds(beneficiariesIds: string[]): void {
        this.beneficiariesIds = beneficiariesIds;
    }




}