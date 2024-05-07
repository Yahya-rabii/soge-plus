export class Card {

    id !: number | 0;
    expirationMonth!: number | 0;
    expirationYear!: number | 0;
    cardRib!: number | 0;
    cvc!: number |0;
    signature! : number|0;




    // constructor AND  AND SETTERS AND GET_ATTRIBUTES AND SET_ATTRIBUTES


    constructor(id?: number, expirationMonth?: number, expirationYear?: number, cardRib?: number, cvc?: number, signature?: number, accountId?: number) {
        this.id = id || 0;
        this.expirationMonth = expirationMonth || 0;
        this.expirationYear = expirationYear|| 0;
        this.cardRib = cardRib|| 0;
        this.cvc = cvc|| 0;
        this.signature = signature|| 0;
    }

    getExpirationDate(): string {
        return `${this.expirationMonth}/${this.expirationYear}`;
    }

    setExpirationDate(month: number, year: number): void {
        this.expirationMonth = month;
        this.expirationYear = year;
    }

    getCardDetails(): string {
        return `Card RIB: ${this.cardRib}, CVC: ${this.cvc}, Signature: ${this.signature}`;
    }

    setCardDetails(rib: number, cvc: number, signature: number): void {
        this.cardRib = rib;
        this.cvc = cvc;
        this.signature = signature;
    }

 

}