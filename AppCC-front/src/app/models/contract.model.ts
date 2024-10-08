import { Address } from './address.model';
import { Credential } from './credential.model';
export class Contract {
  id!: Number;
  creationDate!: Date;
  paymentDuration!: string;
  loanId!: Number;
  isSigned!: boolean;
  clientId!: string;
  constructor(
    id?: Number,
    creationDate?: Date,
    paymentDuration?: string,
    loanId?: Number,
    clientId?: string,
    isSigned?: boolean,
  ) {
    this.id = id || 0;
    this.creationDate = creationDate || new Date();
    this.paymentDuration = paymentDuration || '';
    this.loanId = loanId || 0;
    this.clientId = clientId || '';
    this.isSigned = isSigned || false;
  }
  getCreationDate(): Date {
    return this.creationDate;
  }
  setCreationDate(creationDate: Date): void {
    this.creationDate = creationDate;
  }
  getPaymentDuration(): string {
    return this.paymentDuration;
  }
  getisSigned(): boolean {
    return this.isSigned;
  }
  setPaymentDuration(paymentDuration: string): void {
    this.paymentDuration = paymentDuration;
  }
  getLoanId(): Number {
    return this.loanId;
  }
  setLoanId(loanId: Number): void {
    this.loanId = loanId;
  }
  getClientId(): string {
    return this.clientId;
  }
  setClientId(clientId: string): void {
    this.clientId = clientId;
  }
  setisSigned(isSigned: boolean): void {
    this.isSigned = isSigned;
  }
  toString(): string {
    return `Contract: { creationDate: ${this.creationDate}, paymentDuration: ${this.paymentDuration}, loanId: ${this.loanId}, clientId: ${this.clientId} }`;
  }
}
