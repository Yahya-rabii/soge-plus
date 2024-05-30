import { Address } from './address.model';
import { Credential } from './credential.model';
export class User {
  id!: string | '';
  username!: string | '';
  firstName!: string | '';
  lastName!: string | '';
  email!: string | '';
  hasAccount!: boolean | false;
  rib!: Number | 0;
  emailVerified!: boolean | false;
  credentials!: Credential[] | undefined;
  address!: Address | undefined;
  constructor(
    id?: string,
    username?: string,
    firstName?: string,
    lastName?: string,
    email?: string,
    emailVerified?: boolean,
    hasAccount?: boolean,
    rib?: Number,
    credentials?: Credential[] | undefined,
    asdress?: Address | undefined,
  ) {
    this.id = id || '';
    this.username = username || '';
    this.firstName = firstName || '';
    this.lastName = lastName || '';
    this.email = email || '';
    this.hasAccount = hasAccount || false;
    this.rib = rib || 0;
    this.emailVerified = emailVerified || false;
    this.credentials = credentials || undefined;
    this.address = asdress || undefined;
  }
  public get_attributes(): string {
    return (
      this.username +
      ' ' +
      this.firstName +
      ' ' +
      this.lastName +
      ' ' +
      this.email
    );
  }
  public set_attributes(
    username: string,
    firstName: string,
    lastName: string,
    email: string,
    credentials: Credential[],
    address: Address,
  ): void {
    this.username = username;
    this.firstName = firstName;
    this.lastName = lastName;
    this.email = email;
    this.credentials = credentials;
    this.address = address;
    this.hasAccount = false;
    this.rib = 0;
    this.emailVerified = false;
  }
  public get_id(): string {
    return this.id;
  }
  public get_has_Account(): boolean {
    return this.hasAccount;
  }
  public get_username(): string {
    return this.firstName + ' ' + this.lastName;
  }
  public get_first_name(): string {
    return this.firstName;
  }
  public get_last_name(): string {
    return this.lastName;
  }
  public get_email(): string {
    return this.email;
  }
  public get_credentials(): Credential[] | undefined {
    return this.credentials;
  }
  public get_address(): Address | undefined {
    return this.address?.getAttributes();
  }
  public set_username(username: string): void {
    this.username = username;
  }
  public set_first_name(firstName: string): void {
    this.firstName = firstName;
  }
  public set_last_name(lastName: string): void {
    this.lastName = lastName;
  }
  public set_email(email: string): void {
    this.email = email;
  }
  public set_credentials(credentials: Credential[]): void {
    this.credentials = credentials;
  }
  public set_address(address: Address): void {
    this.address?.setAttributes(
      address.getStreet(),
      address.getCity(),
      address.getPostalCode(),
      address.getCountry(),
    );
  }
}
