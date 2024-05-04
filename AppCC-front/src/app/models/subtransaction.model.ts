

export class SubTransaction {
   

    id!: number | 0;
    userId!: string | '';
    amount!: number | 0;
    transactionDate!: Date;


   
    


    // constructor AND GETTERS AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES

    constructor(
        id ?: number,
        userId?: string,
        amount?: number,
        transactionDate?: Date,
    ) {
        this.id = id || 0;
        this.userId = userId || '';
        this.amount = amount || 0;
        this.transactionDate = transactionDate || new Date();
    }

    public get_attributes(): string {
        return  this.userId + ' ' + this.amount;
    }


    public set_attributes(userId: string, amount: number, bankName: string): void {
      
        this.userId = userId;
        this.amount = amount;
    }
  
    public get_id(): number {
        return this.id;
    }



    public get_userId(): string {
        return this.userId;
    }


    public get_amount(): number {
        return this.amount;
    }

    

   



    public set_id(id: number): void {
        this.id = id;
    }




    public set_userId(userId: string): void {
        this.userId = userId;
    }


    public set_amount(amount: number): void {
        this.amount = amount;
    }







}